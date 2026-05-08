# xrp-tx

A standalone, zero-dependency, class-based transaction builder for the XRP Ledger.

`xrp-tx` is designed to provide a premium developer experience for constructing, validating, and manipulating XRPL transactions. It replaces the legacy union-of-interfaces pattern with a robust class hierarchy, enabling inherited properties, logical grouping, and strict runtime validation.

[![NPM Version](https://img.shields.io/npm/v/xrp-tx.svg)](https://www.npmjs.com/package/xrp-tx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **🚀 Zero Dependencies:** No reliance on `xrpl.js`, `ripple-binary-codec`, or any other runtime libraries.
- **🏗️ Class-Based API:** 71+ transaction types implemented as concrete classes.
- **🛡️ Strict Type Safety:** Built from the ground up for TypeScript, supporting `exactOptionalPropertyTypes`.
- **🧪 Built-in Validation:** Every transaction class includes a `validate()` method for ledger-compliant checks.
- **💎 Immutable Updates:** Use the `.with()` pattern to create modified copies of transactions without side effects.
- **🔌 Registry Pattern:** Easily instantiate transactions from JSON using the central registry or factory methods.
- **🤝 XRPL.js Compatible:** `toJSON()` output matches the exact shape required by `xrpl.js` and the XRPL ledger.

## Installation

```bash
npm install xrp-tx
```

## Quick Start

### Creating a Transaction

```typescript
import { Transaction, PaymentTx } from 'xrp-tx';

// Option 1: Using the convenience factory
const tx = Transaction.payment({
  Account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  Destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
  Amount: '1000000', // 1 XRP in drops
});

// Option 2: Using the concrete class
const payment = new PaymentTx({
  Account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  Destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
  Amount: '1000000',
});

// Validation
payment.validate(); // Throws ValidationError if invalid

// Serialization
const json = payment.toJSON();
console.log(json);
```

### Immutable Updates with `.with()`

```typescript
const tx1 = Transaction.payment({
  Account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  Destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
  Amount: '1000000',
});

// Create a new transaction with a Fee and Sequence
const tx2 = tx1.with({
  Fee: '12',
  Sequence: 42,
});

console.log(tx2.Fee); // '12'
console.log(tx1.Fee); // undefined (tx1 remains unchanged)
```

### Dynamic Instantiation from JSON

```typescript
import { Transaction } from 'xrp-tx';

const blob = {
  TransactionType: 'AccountSet',
  Account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  SetFlag: 8,
};

const tx = Transaction.create(blob.TransactionType, blob);
// tx is an instance of AccountSetTx
```

## Supported Transaction Types (71)

`xrp-tx` provides 100% coverage for standard and experimental XRPL transaction types, including:

- **Core:** `Payment`, `AccountSet`, `TrustSet`, `OfferCreate`, `OfferCancel`, `Check*`, `Escrow*`, `SignerListSet`, etc.
- **NFTs:** `NFTokenMint`, `NFTokenBurn`, `NFTokenCreateOffer`, `NFTokenAcceptOffer`, etc.
- **AMM:** `AMMCreate`, `AMMDeposit`, `AMMWithdraw`, `AMMVote`, `AMMBid`, etc.
- **MPT:** `MPTokenIssuanceCreate`, `MPTokenAuthorize`, etc.
- **Sidechains:** `XChainCreateBridge`, `XChainCommit`, `XChainClaim`, etc.
- **Niche:** `Vault*`, `Loan*`, `Oracle*`, `Credential*`, `DID*`, `Batch`, etc.

## Why use xrp-tx?

Modern XRPL development often requires high-fidelity transaction construction without the overhead of a full ledger library. `xrp-tx` is ideal for:

1. **Lightweight Clients:** Perfect for mobile apps or edge functions where bundle size matters.
2. **Transaction Builders:** Provides a clean UI-to-JSON mapping with instant validation.
3. **Backend Services:** Robust, typed transaction generation for high-throughput environments.
4. **Tooling:** A solid foundation for explorers, wallets, and signing tools.

## Architecture

The library uses a structured hierarchy to maximize code reuse and provide logical groupings:

- `Transaction` (Abstract Base)
  - `AccountTransaction` (Shared account logic)
  - `PaymentTransaction` (Shared value transfer logic)
  - `TokenTransaction` (NFT/MPT/TrustSet logic)
  - `AMMTransaction` / `XChainTransaction` / etc.

## License

MIT
