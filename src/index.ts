/**
 * xrpt — Standalone XRPL Transaction Builder
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
  AuthAccount, XChainClaimAttestation, XChainAccountCreateAttestation,
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
export { AMMTransaction } from './groups/amm.js';
export { XChainTransaction } from './groups/xchain.js';
export { VaultTransaction } from './groups/vault.js';
export { LoanTransaction } from './groups/loan.js';
export { CredentialTransaction } from './groups/credential.js';
export { OracleTransaction } from './groups/oracle.js';
export { PermissionedDomainTransaction } from './groups/permissioned-domain.js';

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

// AMM
export { AMMCreateTx } from './transactions/amm-create.js';
export type { AMMCreateTxFields } from './transactions/amm-create.js';
export { AMMDepositTx } from './transactions/amm-deposit.js';
export type { AMMDepositTxFields } from './transactions/amm-deposit.js';
export { AMMWithdrawTx } from './transactions/amm-withdraw.js';
export type { AMMWithdrawTxFields } from './transactions/amm-withdraw.js';
export { AMMVoteTx } from './transactions/amm-vote.js';
export type { AMMVoteTxFields } from './transactions/amm-vote.js';
export { AMMBidTx } from './transactions/amm-bid.js';
export type { AMMBidTxFields } from './transactions/amm-bid.js';
export { AMMClawbackTx } from './transactions/amm-clawback.js';
export type { AMMClawbackTxFields } from './transactions/amm-clawback.js';
export { AMMDeleteTx } from './transactions/amm-delete.js';
export type { AMMDeleteTxFields } from './transactions/amm-delete.js';

// XChain
export { XChainCreateBridgeTx } from './transactions/xchain-create-bridge.js';
export type { XChainCreateBridgeTxFields } from './transactions/xchain-create-bridge.js';
export { XChainModifyBridgeTx } from './transactions/xchain-modify-bridge.js';
export type { XChainModifyBridgeTxFields } from './transactions/xchain-modify-bridge.js';
export { XChainCommitTx } from './transactions/xchain-commit.js';
export type { XChainCommitTxFields } from './transactions/xchain-commit.js';
export { XChainClaimTx } from './transactions/xchain-claim.js';
export type { XChainClaimTxFields } from './transactions/xchain-claim.js';
export { XChainAccountCreateCommitTx } from './transactions/xchain-account-create-commit.js';
export type { XChainAccountCreateCommitTxFields } from './transactions/xchain-account-create-commit.js';
export { XChainCreateClaimIDTx } from './transactions/xchain-create-claim-id.js';
export type { XChainCreateClaimIDTxFields } from './transactions/xchain-create-claim-id.js';
export { XChainAddClaimAttestationTx } from './transactions/xchain-add-claim-attestation.js';
export type { XChainAddClaimAttestationTxFields } from './transactions/xchain-add-claim-attestation.js';
export { XChainAddAccountCreateAttestationTx } from './transactions/xchain-add-account-create-attestation.js';
export type { XChainAddAccountCreateAttestationTxFields } from './transactions/xchain-add-account-create-attestation.js';

// Vaults
export { VaultCreateTx } from './transactions/vault-create.js';
export type { VaultCreateTxFields } from './transactions/vault-create.js';
export { VaultDepositTx } from './transactions/vault-deposit.js';
export type { VaultDepositTxFields } from './transactions/vault-deposit.js';
export { VaultWithdrawTx } from './transactions/vault-withdraw.js';
export type { VaultWithdrawTxFields } from './transactions/vault-withdraw.js';
export { VaultSetTx } from './transactions/vault-set.js';
export type { VaultSetTxFields } from './transactions/vault-set.js';
export { VaultDeleteTx } from './transactions/vault-delete.js';
export type { VaultDeleteTxFields } from './transactions/vault-delete.js';
export { VaultClawbackTx } from './transactions/vault-clawback.js';
export type { VaultClawbackTxFields } from './transactions/vault-clawback.js';

// Loans
export { LoanSetTx } from './transactions/loan-set.js';
export type { LoanSetTxFields } from './transactions/loan-set.js';
export { LoanDeleteTx } from './transactions/loan-delete.js';
export type { LoanDeleteTxFields } from './transactions/loan-delete.js';
export { LoanManageTx } from './transactions/loan-manage.js';
export type { LoanManageTxFields } from './transactions/loan-manage.js';
export { LoanPayTx } from './transactions/loan-pay.js';
export type { LoanPayTxFields } from './transactions/loan-pay.js';
export { LoanBrokerSetTx } from './transactions/loan-broker-set.js';
export type { LoanBrokerSetTxFields } from './transactions/loan-broker-set.js';
export { LoanBrokerDeleteTx } from './transactions/loan-broker-delete.js';
export type { LoanBrokerDeleteTxFields } from './transactions/loan-broker-delete.js';
export { LoanBrokerCoverClawbackTx } from './transactions/loan-broker-cover-clawback.js';
export type { LoanBrokerCoverClawbackTxFields } from './transactions/loan-broker-cover-clawback.js';
export { LoanBrokerCoverDepositTx } from './transactions/loan-broker-cover-deposit.js';
export type { LoanBrokerCoverDepositTxFields } from './transactions/loan-broker-cover-deposit.js';
export { LoanBrokerCoverWithdrawTx } from './transactions/loan-broker-cover-withdraw.js';
export type { LoanBrokerCoverWithdrawTxFields } from './transactions/loan-broker-cover-withdraw.js';

// Credentials
export { CredentialCreateTx } from './transactions/credential-create.js';
export type { CredentialCreateTxFields } from './transactions/credential-create.js';
export { CredentialAcceptTx } from './transactions/credential-accept.js';
export type { CredentialAcceptTxFields } from './transactions/credential-accept.js';
export { CredentialDeleteTx } from './transactions/credential-delete.js';
export type { CredentialDeleteTxFields } from './transactions/credential-delete.js';

// Oracles
export { OracleSetTx } from './transactions/oracle-set.js';
export type { OracleSetTxFields } from './transactions/oracle-set.js';
export { OracleDeleteTx } from './transactions/oracle-delete.js';
export type { OracleDeleteTxFields } from './transactions/oracle-delete.js';

// Permissioned Domain
export { PermissionedDomainSetTx } from './transactions/permissioned-domain-set.js';
export type { PermissionedDomainSetTxFields } from './transactions/permissioned-domain-set.js';
export { PermissionedDomainDeleteTx } from './transactions/permissioned-domain-delete.js';
export type { PermissionedDomainDeleteTxFields } from './transactions/permissioned-domain-delete.js';

// Batch
export { BatchTx } from './transactions/batch.js';
export type { BatchTxFields } from './transactions/batch.js';

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
