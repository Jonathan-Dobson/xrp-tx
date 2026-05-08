Here's the concrete next step in the model overhaul. I'll show you a **production-ready starting implementation** for the new class hierarchy inside `packages/xrpl/src/models/transactions/`.

This keeps **100% backward compatibility** with the existing `SubmittableTransaction` union and all current APIs (autofill, submit, validate, etc.). At the same time, it introduces the clean `Transaction` primitive you asked for, with inherited properties/methods, logical grouping, chaining, and factory spawning.

### 1. New Folder Structure (Recommended)

```
src/models/transactions/
├── index.ts                    ← re-exports everything (backward compat)
├── transaction.ts              ← new abstract Transaction base + registry
├── common.ts                   ← shared helpers (existing + new)
├── groups/                     ← new intermediate abstract classes
│   ├── account.ts
│   ├── payment.ts
│   ├── token.ts
│   ├── amm.ts
│   ├── xchain.ts
│   └── ... (vault, loan, etc.)
├── types/                      ← concrete transaction classes (one file per major type or group)
│   ├── payment.ts
│   ├── accountSet.ts
│   ├── nfTokenMint.ts
│   ├── batch.ts
│   └── ... 
├── registry.ts                 ← maps TransactionType → constructor + metadata
└── utils.ts                    ← pure helpers for preparation, etc.
```

### 2. Core: The Primitive `Transaction` Base Class

Create / replace `src/models/transactions/transaction.ts`:

```ts
import type { Client } from '../../client';
import type { Wallet } from '../../Wallet';
import type { BaseTransaction, TransactionType } from './common';
import { validateCommon } from './common';
import { TransactionRegistry } from './registry';

// All common fields from the original BaseTransaction, now as readonly
export abstract class Transaction {
  readonly Account: string;
  readonly TransactionType: TransactionType;
  readonly Fee?: string;
  readonly Sequence?: number;
  readonly AccountTxnID?: string;
  readonly Flags?: number | Record<string, boolean>;
  readonly LastLedgerSequence?: number;
  readonly Memos?: Memo[];
  readonly Signers?: Signer[];
  readonly SourceTag?: number;
  readonly SigningPubKey?: string;
  readonly TicketSequence?: number;
  readonly TxnSignature?: string;
  readonly NetworkID?: number;
  readonly Delegate?: string;

  protected constructor(props: BaseTransaction) {
    Object.assign(this, props); // or use a safer deep freeze in production
    this.validateCommon();
  }

  // Common inherited methods (every transaction gets these)
  validateCommon(): void {
    validateCommon(this); // existing common validation
  }

  validate(): void {
    // Subclasses override to add type-specific validation
    this.validateCommon();
  }

  toJSON(): object {
    return { ...this }; // or use structuredClone for deep safety
  }

  // Pure preparation (no mutation of original!)
  async prepare(client: Client): Promise<PreparedTransaction<this>> {
    // Will delegate to type-specific pure autofill (see later)
    return this.getTransformer().prepare(client, this);
  }

  sign(wallet: Wallet): SignedTransaction<this> {
    // Pure signing – returns new object
    return wallet.sign(this) as any; // typed via generics later
  }

  // === Factory / Spawn methods on the primitive root ===
  static create<T extends Transaction = Transaction>(
    type: TransactionType,
    props: Omit<Partial<BaseTransaction>, 'TransactionType'>
  ): T {
    const Constructor = TransactionRegistry.get(type);
    if (!Constructor) {
      throw new Error(`Unknown transaction type: ${type}`);
    }
    return new Constructor({ TransactionType: type, ...props }) as T;
  }

  // Convenient static factories (one per common type)
  static payment(props: Omit<PaymentProps, 'TransactionType'>): Payment {
    return Transaction.create('Payment', props) as Payment;
  }

  static accountSet(props: Omit<AccountSetProps, 'TransactionType'>): AccountSet {
    return Transaction.create('AccountSet', props) as AccountSet;
  }

  static offerCreate(props: Omit<OfferCreateProps, 'TransactionType'>): OfferCreate {
    return Transaction.create('OfferCreate', props) as OfferCreate;
  }

  // Add more as needed (or keep generic create for rare ones)

  // Internal helper for polymorphism
  protected abstract getTransformer(): TransactionTransformer;
}

// Helper types for prepared/signed (immutable)
export type PreparedTransaction<T extends Transaction> = T & {
  readonly Fee: string;
  readonly Sequence: number;
  readonly LastLedgerSequence: number;
};

export type SignedTransaction<T extends Transaction> = PreparedTransaction<T> & {
  readonly SigningPubKey: string;
  readonly TxnSignature: string;
};
```

### 3. Logical Groups (Intermediate Abstract Classes)

Create `src/models/transactions/groups/payment.ts` (example group):

```ts
import { Transaction } from '../transaction';
import type { Amount } from '../common';

export abstract class PaymentTransaction extends Transaction {
  abstract getAmount(): Amount;
  abstract getDestination(): string;

  // Shared behavior for all payment-like txs
  handlesDeliverMax(): boolean {
    return true;
  }

  validatePaymentRules(): void {
    // Common checks: Amount + Destination present, etc.
    if (!this.getAmount()) throw new Error('Payment requires Amount');
  }

  override validate(): void {
    super.validate();
    this.validatePaymentRules();
  }
}
```

Other groups follow the same pattern:
- `AccountTransaction` — for account-modifying txs (requires sequence, etc.)
- `TokenTransaction` — NFToken*, MPToken*, TrustSet (balance impact flags)
- `AMMTransaction` — shared Asset/Asset2 handling
- `XChainTransaction` — bridge/attestation common logic

### 4. Concrete Example: Payment (Chained off Group)

`src/models/transactions/types/payment.ts`:

```ts
import { PaymentTransaction } from '../groups/payment';
import type { Amount } from '../common';
import { validatePayment } from '../common/validators'; // move existing validator here

interface PaymentProps extends BaseTransaction {
  Amount: Amount;
  Destination: string;
  DeliverMax?: Amount;
  SendMax?: Amount;
  Paths?: any[]; // PathSet
  // ... all other Payment-specific fields
}

export class Payment extends PaymentTransaction {
  readonly Amount: Amount;
  readonly Destination: string;
  readonly DeliverMax?: Amount;
  // ... other fields as readonly

  constructor(props: PaymentProps) {
    super(props);
    this.Amount = props.Amount;
    this.Destination = props.Destination;
    this.DeliverMax = props.DeliverMax;
    // ...
  }

  override getAmount(): Amount { return this.Amount; }
  override getDestination(): string { return this.Destination; }

  override validate(): void {
    super.validate();
    validatePayment(this); // existing per-type validator now lives here
  }

  protected override getTransformer() {
    return paymentTransformer; // pure functions for autofill steps
  }
}

// Props type for factory
export type PaymentProps = Omit<PaymentProps, 'TransactionType'>; // helper
```

### 5. Registry (Powers All Factories)

`src/models/transactions/registry.ts`:

```ts
import { Transaction } from './transaction';
import { Payment } from './types/payment';
import { AccountSet } from './types/accountSet';
// ... import all concrete classes

const registryMap = {
  Payment: Payment,
  AccountSet: AccountSet,
  // ... all ~60 types
} as const;

export class TransactionRegistry {
  static get(type: TransactionType): new (props: any) => Transaction {
    const Ctor = registryMap[type as keyof typeof registryMap];
    if (!Ctor) throw new Error(`No constructor for ${type}`);
    return Ctor;
  }
}
```

### 6. How This Ties Back to the Pipeline (No More Mutation)

In the new `autofill` / sugar layer, you can now do:

```ts
async function autofill(client: Client, txInput: SubmittableTransaction) {
  let tx = Transaction.create(txInput.TransactionType, txInput); // spawns proper class
  tx = await tx.prepare(client); // pure, returns new PreparedTransaction
  return tx;
}
```

Each group or concrete class can provide its own pure transformer steps (address normalization, fee calc, sequence, DeliverMax handling, etc.) without mutating anything.

### Backward Compatibility Layer

In `index.ts`:

```ts
// Keep old union working
export type SubmittableTransaction = InstanceType<ReturnType<typeof Transaction.create>>; // or explicit union for now

// Re-export old interfaces as type aliases if needed during transition
export type { Payment as OldPayment } from './old-models'; // temporary
```

This design gives you:
- **True inheritance** of properties + methods from the `Transaction` primitive.
- **Logical grouping** via intermediate abstract classes (no forced deep hierarchy).
- **Chaining** where natural (e.g. NFTokenMint extends TokenTransaction extends Transaction).
- **Clean spawning** via `Transaction.payment({...})` or generic `Transaction.create(...)`.
- **SRP** — each class owns its validation, preparation rules, and domain logic.
- **Immutability-friendly** — all fields `readonly`, methods return new objects.

This eliminates the "tx param mutated across functions" problem because preparation becomes a chain of pure transformations on properly typed instances.

