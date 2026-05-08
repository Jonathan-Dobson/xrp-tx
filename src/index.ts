/**
 * xrp-tx — Standalone XRPL Transaction Builder
 *
 * A zero-dependency package for creating, validating, and manipulating
 * XRP Ledger transactions with a clean class-based API.
 *
 * @packageDocumentation
 */

// Initialize the registry (must be first — wires up Transaction.create())
import './registry.js';

// ─── Core ────────────────────────────────────────────────────────────
export { Transaction } from './transaction.js';
export { TransactionRegistry } from './registry.js';
export { ValidationError, TransactionError } from './errors.js';

// ─── Types ───────────────────────────────────────────────────────────
export type {
  Amount, IssuedCurrencyAmount, MPTAmount, ClawbackAmount,
  IssuedCurrency, Currency,
  Memo, Signer, PathStep, Path, XChainBridge,
  AuthorizeCredential, SignerEntry, OracleDataSeries,
  BaseTransactionFields, PreparedTransactionFields, SignedTransactionFields,
  TransactionType,
  GlobalFlagsInterface, PaymentFlagsInterface, AccountSetFlagsInterface,
  TrustSetFlagsInterface, OfferCreateFlagsInterface,
  NFTokenMintFlagsInterface, NFTokenCreateOfferFlagsInterface,
  PaymentChannelClaimFlagsInterface,
  AMMDepositFlagsInterface, AMMWithdrawFlagsInterface,
  MPTokenAuthorizeFlagsInterface, ClawbackFlagsInterface,
  XChainModifyBridgeFlagsInterface, BatchFlagsInterface,
} from './types/index.js';

export {
  GlobalFlags, PaymentFlags, AccountSetAsfFlags, AccountSetTfFlags,
  TrustSetFlags, OfferCreateFlags,
  NFTokenMintFlags, NFTokenCreateOfferFlags,
  PaymentChannelClaimFlags,
  AMMDepositFlags, AMMWithdrawFlags,
  MPTokenAuthorizeFlags, ClawbackFlags,
  XChainModifyBridgeFlags, BatchFlags,
} from './types/index.js';

// ─── Group abstract classes ──────────────────────────────────────────
export { AccountTransaction } from './groups/account.js';
export { PaymentTransaction } from './groups/payment.js';
export { TokenTransaction } from './groups/token.js';
export { OfferTransaction } from './groups/offer.js';

// ─── Concrete transaction classes ────────────────────────────────────

// Account management
export { PaymentTx } from './transactions/payment.js';
export type { PaymentTxFields } from './transactions/payment.js';
export { AccountSetTx } from './transactions/account-set.js';
export type { AccountSetTxFields } from './transactions/account-set.js';
export { AccountDeleteTx } from './transactions/account-delete.js';
export type { AccountDeleteTxFields } from './transactions/account-delete.js';
export { SetRegularKeyTx } from './transactions/set-regular-key.js';
export type { SetRegularKeyTxFields } from './transactions/set-regular-key.js';
export { SignerListSetTx } from './transactions/signer-list-set.js';
export type { SignerListSetTxFields } from './transactions/signer-list-set.js';
export { TicketCreateTx } from './transactions/ticket-create.js';
export type { TicketCreateTxFields } from './transactions/ticket-create.js';
export { DepositPreauthTx } from './transactions/deposit-preauth.js';
export type { DepositPreauthTxFields } from './transactions/deposit-preauth.js';
export { ClawbackTx } from './transactions/clawback.js';
export type { ClawbackTxFields } from './transactions/clawback.js';
export { DelegateSetTx } from './transactions/delegate-set.js';
export type { DelegateSetTxFields } from './transactions/delegate-set.js';

// Payments & value transfer
export { TrustSetTx } from './transactions/trust-set.js';
export type { TrustSetTxFields } from './transactions/trust-set.js';
export { EscrowCreateTx } from './transactions/escrow-create.js';
export type { EscrowCreateTxFields } from './transactions/escrow-create.js';
export { EscrowFinishTx } from './transactions/escrow-finish.js';
export type { EscrowFinishTxFields } from './transactions/escrow-finish.js';
export { EscrowCancelTx } from './transactions/escrow-cancel.js';
export type { EscrowCancelTxFields } from './transactions/escrow-cancel.js';
export { CheckCreateTx } from './transactions/check-create.js';
export type { CheckCreateTxFields } from './transactions/check-create.js';
export { CheckCashTx } from './transactions/check-cash.js';
export type { CheckCashTxFields } from './transactions/check-cash.js';
export { CheckCancelTx } from './transactions/check-cancel.js';
export type { CheckCancelTxFields } from './transactions/check-cancel.js';
export { PaymentChannelCreateTx } from './transactions/payment-channel-create.js';
export type { PaymentChannelCreateTxFields } from './transactions/payment-channel-create.js';
export { PaymentChannelFundTx } from './transactions/payment-channel-fund.js';
export type { PaymentChannelFundTxFields } from './transactions/payment-channel-fund.js';
export { PaymentChannelClaimTx } from './transactions/payment-channel-claim.js';
export type { PaymentChannelClaimTxFields } from './transactions/payment-channel-claim.js';

// DEX
export { OfferCreateTx } from './transactions/offer-create.js';
export type { OfferCreateTxFields } from './transactions/offer-create.js';
export { OfferCancelTx } from './transactions/offer-cancel.js';
export type { OfferCancelTxFields } from './transactions/offer-cancel.js';

// NFTokens
export { NFTokenMintTx } from './transactions/nftoken-mint.js';
export type { NFTokenMintTxFields } from './transactions/nftoken-mint.js';
export { NFTokenBurnTx } from './transactions/nftoken-burn.js';
export type { NFTokenBurnTxFields } from './transactions/nftoken-burn.js';
export { NFTokenCreateOfferTx } from './transactions/nftoken-create-offer.js';
export type { NFTokenCreateOfferTxFields } from './transactions/nftoken-create-offer.js';
export { NFTokenCancelOfferTx } from './transactions/nftoken-cancel-offer.js';
export type { NFTokenCancelOfferTxFields } from './transactions/nftoken-cancel-offer.js';
export { NFTokenAcceptOfferTx } from './transactions/nftoken-accept-offer.js';
export type { NFTokenAcceptOfferTxFields } from './transactions/nftoken-accept-offer.js';
export { NFTokenModifyTx } from './transactions/nftoken-modify.js';
export type { NFTokenModifyTxFields } from './transactions/nftoken-modify.js';

// Multi-Purpose Tokens
export { MPTokenIssuanceCreateTx } from './transactions/mptoken-issuance-create.js';
export type { MPTokenIssuanceCreateTxFields } from './transactions/mptoken-issuance-create.js';
export { MPTokenIssuanceDestroyTx } from './transactions/mptoken-issuance-destroy.js';
export type { MPTokenIssuanceDestroyTxFields } from './transactions/mptoken-issuance-destroy.js';
export { MPTokenIssuanceSetTx } from './transactions/mptoken-issuance-set.js';
export type { MPTokenIssuanceSetTxFields } from './transactions/mptoken-issuance-set.js';
export { MPTokenAuthorizeTx } from './transactions/mptoken-authorize.js';
export type { MPTokenAuthorizeTxFields } from './transactions/mptoken-authorize.js';

// DID
export { DIDSetTx } from './transactions/did-set.js';
export type { DIDSetTxFields } from './transactions/did-set.js';
export { DIDDeleteTx } from './transactions/did-delete.js';
export type { DIDDeleteTxFields } from './transactions/did-delete.js';

// ─── Validation utilities ────────────────────────────────────────────
export {
  isAmount, isIssuedCurrencyAmount, isMPTAmount,
  isAccount, isMemo, isSigner, isHex,
  isDomainID, isFlagEnabled,
} from './validation/index.js';
