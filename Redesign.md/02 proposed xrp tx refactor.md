The current flat union of ~60 interfaces (all extending `BaseTransaction` with no methods or behavior) makes the transaction pipeline feel scattered and mutation-heavy. By introducing a **class-based hierarchy** with `Transaction` as the primitive root, we give every transaction type:

- Inherited common properties + shared behavior (methods).
- Clear grouping via intermediate abstract classes (logical “inheritance” for similar tx types).
- Chaining where it makes sense (complex tx types extend more primitive group bases).
- A clean **factory/spawn mechanism** on the root `Transaction` class so you can create any specific type without touching the concrete classes directly.

This keeps full backward compatibility (we’ll keep the old `SubmittableTransaction` union as a type alias) while moving to real objects that own their responsibilities (validation, preparation, serialization, etc.).

### Current Property Analysis (from the actual codebase)

**BaseTransaction** (the true primitive today — every tx inherits these fields):

```ts
export interface BaseTransaction extends Record<string, unknown> {
  Account: Account;                    // required
  TransactionType: string;             // the discriminator
  Fee?: string;
  Sequence?: number;
  AccountTxnID?: string;
  Flags?: number | GlobalFlagsInterface;
  LastLedgerSequence?: number;
  Memos?: Memo[];
  Signers?: Signer[];
  SourceTag?: number;
  SigningPubKey?: string;
  TicketSequence?: number;
  TxnSignature?: string;
  NetworkID?: number;
  Delegate?: Account;
}
```

Shared supporting types (used across many txs): `Amount`, `IssuedCurrencyAmount`, `MPTAmount`, `Currency`, `Memo`, `Signer`, `XChainBridge`, etc.

**Specific tx types** add 2–10 extra fields each (e.g. `Payment` adds `Amount`, `Destination`, optional `Paths`, `DeliverMax`, etc.; `NFTokenMint` adds `NFTokenTaxon`, `URI`, etc.).  
There are **zero methods** today — all logic lives outside the models (validators, autofill helpers, etc.).

### Proposed Class Hierarchy

```ts
// 1. Root primitive
abstract class Transaction {
  // All common BaseTransaction fields (immutable)
  readonly Account: Account;
  readonly TransactionType: TransactionType;  // we'll make this a proper union/enum
  readonly Fee?: string;
  readonly Sequence?: number;
  // ... all other BaseTransaction fields as readonly

  protected constructor(props: BaseTransaction) {
    // assign + basic validation
    this.Account = props.Account;
    // ...
    this.validateCommon();
  }

  // Common methods (inherited by EVERYTHING)
  validate(): void { /* dispatches to type-specific */ }
  toJSON(): object { /* safe serialization */ }
  toBlob(): string { /* binary codec helper */ }
  prepare(client: Client): Promise<PreparedTransaction<this>> { /* pure autofill */ }
  sign(wallet: Wallet): SignedTransaction<this> { /* pure signing */ }

  // Factory / "spawn" methods (the magic you asked for)
  static payment(props: Omit<PaymentProps, 'TransactionType'>): Payment {
    return new Payment({ TransactionType: 'Payment', ...props });
  }
  static offerCreate(props: Omit<OfferCreateProps, 'TransactionType'>): OfferCreate { ... }
  static accountSet(props: Omit<AccountSetProps, 'TransactionType'>): AccountSet { ... }
  // ... one static per type (or a generic .create() with overloads)

  // Generic spawn (fallback)
  static create<T extends SubmittableTransaction>(
    type: TransactionType,
    props: Partial<Omit<T, 'TransactionType'>>
  ): T {
    // internal registry dispatch to the right constructor
  }
}

// 2. Logical groups (intermediate abstract classes)
// These capture shared domain behavior even when they don't share extra fields

abstract class AccountTransaction extends Transaction {
  // Common account-management helpers
  requiresSequence(): boolean { return true; }
  validateAccountRules(): void { /* e.g. no empty Account */ }
}

abstract class PaymentTransaction extends Transaction {
  // Common payment primitives (Amount + Destination logic)
  abstract getAmount(): Amount;
  handlesDeliverMax(): boolean { return true; }
  // ... shared path-finding or tag logic
}

abstract class TokenTransaction extends Transaction {
  // NFToken / MPToken / TrustSet common
  abstract affectsTokenBalance(): boolean;
}

abstract class AMMTransaction extends Transaction {
  // All AMM* share Asset/Asset2 patterns
  abstract getAsset(): IssuedCurrency;
}

abstract class XChainTransaction extends Transaction {
  // Bridge/attestation common fields
  abstract getBridge(): XChainBridge;
}

// 3. More complex types chain off the primitives/groups

// Simple primitive example
class AccountSet extends AccountTransaction {
  readonly SetFlag?: number;
  readonly ClearFlag?: number;
  readonly Domain?: string;
  // ... its specific fields

  constructor(props: AccountSetProps) {
    super(props);
    this.validateSpecific();
  }

  override validate(): void {
    super.validate();
    validateAccountSet(this); // existing validator, now owned here
  }
}

// Complex example (chains off group)
class NFTokenMint extends TokenTransaction {
  readonly NFTokenTaxon: number;
  readonly URI?: string;
  readonly MintAccount?: string;
  // ...

  override affectsTokenBalance() { return true; }
}

// Even more complex (Batch contains other transactions)
class Batch extends Transaction {
  readonly Transactions: SubmittableTransaction[]; // or typed array of Transaction instances

  constructor(props: BatchProps) {
    super(props);
  }

  // Batch-specific method
  validateInnerTransactions(): void { /* recurse validate() on each */ }
}
```

### Grouping & Chaining Strategy (Based on All Current Types)

I grouped the ~60 types from the current `SubmittableTransaction` union using domain similarity (the same groupings the XRPL spec itself uses). Where possible, I chained complex ones off simpler primitives:

| Group (Abstract Class)       | Extends          | Member Types (examples)                              | Why this grouping / chaining? |
|------------------------------|------------------|------------------------------------------------------|-------------------------------|
| **AccountTransaction**       | `Transaction`    | AccountSet, AccountDelete, SetRegularKey, SignerListSet, DelegateSet, DepositPreauth, TicketCreate, TrustSet, Clawback | All modify account state; share sequence/flag rules. |
| **PaymentTransaction**       | `Transaction`    | Payment, CheckCreate, CheckCash, CheckCancel, EscrowCreate, EscrowFinish, EscrowCancel, PaymentChannel* | All move value; share Amount/Destination/DeliverMax logic. |
| **TokenTransaction**         | `Transaction`    | NFTokenMint, NFTokenBurn, NFTokenCreateOffer, NFTokenCancelOffer, NFTokenAcceptOffer, NFTokenModify, MPToken*, TrustSet | All deal with tokens/NFTs; share balance-affecting rules. |
| **AMMTransaction**           | `Transaction`    | AMMCreate, AMMDeposit, AMMWithdraw, AMMVote, AMMBid, AMMClawback, AMMDelete | All operate on the same AMM objects; share Asset/Asset2 fields. |
| **XChainTransaction**        | `Transaction`    | XChainCreateBridge, XChainModifyBridge, XChainCommit, XChainClaim, XChain*Attestation* | All cross-chain; share bridge/attestation structures. |
| **VaultTransaction**         | `Transaction`    | VaultCreate, VaultDeposit, VaultWithdraw, VaultSet, VaultDelete, VaultClawback | All vault-specific; can chain off a future Vault primitive if more fields are added. |
| **LoanTransaction**          | `Transaction`    | LoanSet, LoanPay, LoanManage, LoanDelete + LoanBroker* | Newer lending primitives; Broker variants chain off Loan for shared rules. |
| **CredentialTransaction**    | `Transaction`    | CredentialCreate, CredentialAccept, CredentialDelete | Simple credential lifecycle. |
| **OracleTransaction**        | `Transaction`    | OracleSet, OracleDelete | Oracle-specific. |
| **PermissionedDomain**       | `Transaction`    | PermissionedDomainSet, PermissionedDomainDelete | Domain policy. |
| **OfferTransaction**         | `Transaction`    | OfferCreate, OfferCancel | Pure DEX offers. |
| **Batch**                    | `Transaction`    | (standalone)                                         | Special container; holds array of other `Transaction` instances. |

**PseudoTransaction** types (EnableAmendment, SetFee, UNLModify) stay as a separate union — they are validator-only and don’t need the full client-facing hierarchy.

This gives you **logical inheritance** without forcing unnatural deep chains. Most groups only add 1–3 shared methods; the leaf classes add their specific props + overrides.

### How You’d Use It (Clean API)

```ts
// Spawn via the primitive root — no need to import concrete classes
const tx = Transaction.payment({
  Account: "r...",
  Amount: "1000000",
  Destination: "r..."
});

tx.validate();           // inherited + type-specific
const prepared = await tx.prepare(client);  // pure, no mutation
const signed = tx.sign(wallet);             // returns SignedTransaction<Payment>

// Or generic spawn
const offer = Transaction.create('OfferCreate', { ... });
```

### Migration & Best-Practice Notes

- Keep the old `SubmittableTransaction` union as `type SubmittableTransaction = InstanceType<ReturnType<typeof Transaction.create>>` (or a mapped type) for 100% backward compat.
- Move existing per-type validators into the class `.validate()` methods.
- The `prepare()` method can now call pure transformers we discussed earlier, returning a new immutable instance.
- No runtime prototype mutation — everything is clean ES6 class inheritance (which under the hood is still prototypes, but you never touch them directly).

This design gives every transaction **clear responsibilities**, eliminates the mutation-in-multiple-functions pattern (each class prepares itself immutably), and scales beautifully when XRPL adds new tx types — just drop it into the right group and add one static factory.

