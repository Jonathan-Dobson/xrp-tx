**The current `SubmittableTransaction` design is a classic example of “it works, but it doesn’t scale cleanly,” and it directly contributes to the mutation-heavy, responsibility-blurred transaction pipeline.

### What `SubmittableTransaction` Actually Is (Current Code, April 2026)

From the exact source (`packages/xrpl/src/models/transactions/transaction.ts`):

```ts
/**
 * Transactions that can be submitted by clients
 * @category Transaction Models
 */
export type SubmittableTransaction =
  | AMMBid
  | AMMClawback
  | AMMCreate
  | AMMDelete
  | AMMDeposit
  | AMMVote
  | AMMWithdraw
  | AccountDelete
  | AccountSet
  | Batch
  | CheckCancel
  | CheckCash
  | CheckCreate
  | Clawback
  | CredentialAccept
  | CredentialCreate
  | CredentialDelete
  | DIDDelete
  | DIDSet
  | DelegateSet
  | DepositPreauth
  | EscrowCancel
  | EscrowCreate
  | EscrowFinish
  | LoanBrokerSet
  | LoanBrokerCoverClawback
  | LoanBrokerCoverDeposit
  | LoanBrokerCoverWithdraw
  | LoanBrokerDelete
  | LoanSet
  | LoanDelete
  | LoanManage
  | LoanPay
  | MPTokenAuthorize
  | MPTokenIssuanceCreate
  | MPTokenIssuanceDestroy
  | MPTokenIssuanceSet
  | NFTokenAcceptOffer
  | NFTokenBurn
  | NFTokenCancelOffer
  | NFTokenCreateOffer
  | NFTokenMint
  | NFTokenModify
  | OfferCancel
  | OfferCreate
  | OracleDelete
  | OracleSet
  | Payment
  | PaymentChannelClaim
  | PaymentChannelCreate
  | PaymentChannelFund
  | PermissionedDomainSet
  | PermissionedDomainDelete
  | SetRegularKey
  | SignerListSet
  | TicketCreate
  | TrustSet
  | VaultClawback
  | VaultCreate
  | VaultDelete
  | VaultDeposit
  | VaultSet
  | VaultWithdraw
  | XChainAccountCreateCommit
  | XChainAddAccountCreateAttestation
  | XChainAddClaimAttestation
  | XChainClaim
  | XChainCommit
  | XChainCreateBridge
  | XChainCreateClaimID
  | XChainModifyBridge
```

It is **a massive discriminated union** of ~50+ individual transaction interfaces.

There is also:
- `PseudoTransaction` → validator-only txs (`EnableAmendment | SetFee | UNLModify`)
- `Transaction = SubmittableTransaction | PseudoTransaction` → everything that can ever appear on-ledger

All of these ultimately extend (or are based on) `BaseTransaction` from `./common`, which provides the common fields (`Account`, `TransactionType`, `Fee`, `Sequence`, `Flags`, `LastLedgerSequence`, etc.).

### How It Distinguishes Between Transaction Types

**TypeScript level (compile-time):**
- Discriminated union on the literal `TransactionType` field.
- Every specific interface looks like this (example from `Payment`):

  ```ts
  export interface Payment extends BaseTransaction {
    TransactionType: 'Payment'
    Amount: Amount
    Destination: string
    // ... type-specific fields (DeliverMax, SendMax, Paths, etc.)
  }
  ```

  When you write `const tx: SubmittableTransaction = { ... }`, TypeScript narrows correctly based on `tx.TransactionType`. Inside `autofill`, `submit`, etc., the compiler knows exactly which fields are legal.

**Runtime level:**
- There is **no single “isSubmittable” check** on the `SubmittableTransaction` type itself.
- Validation is **per-transaction-type** and lives in each model file (e.g., `validatePayment`, `validateAccountSet`, `validateNFTokenMint`, etc.).
- These validators are built with small helpers (runtime type guards in `common.ts` + JSON schemas in `src/common/schemas/`).
- A top-level `validate(transaction: unknown)` function (exported from the models) dispatches based on `transaction.TransactionType` (or throws `ValidationError`).
- In practice, `Client.autofill()` and `Client.submit()` internally run enough validation to catch obvious shape errors, but the full `validate()` is something you can (and should) call yourself if you want strict checking before submission.

So yes — validation **absolutely depends on the transaction type**. The library uses the `TransactionType` string as the runtime discriminator to pick the right validator, required-field checks, optional-field checks, and business-rule validations (e.g., `TransferRate` bounds on `AccountSet`, `DeliverMax` logic on `Payment`, etc.).

### Why This Feels Substandard (and Why a Model Overhaul Makes Sense)

1. **Flat, monolithic union** — Every time XRPL adds a new transaction type (Loan*, Vault*, PermissionedDomain*, etc.), you have to touch the giant union in `transaction.ts` + add a new file + update validators + update tests. It’s maintenance-heavy.

2. **No real object classification / SRP** — The models are just bags of interfaces. There is no `Transaction` base class/object that knows how to validate or prepare *itself*. All the logic is scattered across sugar helpers, per-type validators, and the mutation-heavy autofill pipeline.

3. **Validation is bolted on** — It’s not part of the type in a composable way. You can create a `SubmittableTransaction` that passes TypeScript but fails runtime validation (or vice-versa in edge cases).

4. **Ties back to the mutation problem** — Because the model is just a plain object union, the autofill helpers have to mutate fields in place (or shallow-copy + mutate) instead of returning a properly typed, immutable `PreparedTransaction<Payment>` or similar.

### Recommended Model Overhaul

We can keep full backward compatibility while making this much cleaner, more extensible, and aligned with your goals (better classification, logical “inheritance” via composition, pure functions, no stepping outside responsibilities).

**Proposed structure:**

```ts
// 1. Base (immutable-friendly)
interface BaseTransaction {
  readonly Account: string
  readonly TransactionType: TransactionType // string literal union or enum
  readonly Fee?: string
  readonly Sequence?: number
  // ... common fields as readonly
}

// 2. Specific transactions become composable (still discriminated)
interface Payment extends BaseTransaction {
  readonly TransactionType: 'Payment'
  readonly Amount: Amount
  readonly Destination: string
  // no mutation — everything readonly
}

// 3. Generic prepared/signed wrappers
type PreparedTransaction<T extends SubmittableTransaction> = T & {
  readonly Fee: string
  readonly Sequence: number
  readonly LastLedgerSequence: number
  // etc.
}

type SignedTransaction<T extends SubmittableTransaction> = PreparedTransaction<T> & {
  readonly SigningPubKey: string
  readonly TxnSignature: string
}

// 4. Registry / factory for validation & preparation (replaces giant union)
const TransactionRegistry = {
  Payment: {
    validate: validatePayment,
    autofill: autofillPaymentPure, // pure version
    // etc.
  },
  // ...
} as const

type TransactionType = keyof typeof TransactionRegistry
```

**Benefits:**
- `SubmittableTransaction` can become a mapped type over the registry → automatically stays up-to-date when new tx types are added.
- Each transaction “class” (or module) owns its own validation, preparation logic, and any type-specific behavior (SRP win).
- Autofill pipeline becomes a pure composition: `prepare(tx) = registry[tx.TransactionType].autofill(client, tx)`
- Validation is now explicit and type-safe: `registry[tx.TransactionType].validate(tx)`
- You can add typed builders if you want fluent API: `new PaymentBuilder().amount(...).destination(...) .build()`

This eliminates the mutation-in-multiple-functions pattern because preparation becomes a chain of pure transformers that return new objects with the correct narrowed type.
