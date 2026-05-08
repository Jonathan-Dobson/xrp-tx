/**
 * Transaction Registry — maps TransactionType strings to constructors.
 *
 * This is the single dispatch table that powers `Transaction.create()`.
 * When adding a new transaction type, register it here.
 */
import type { TransactionType } from './types/transaction-types.js';
import { Transaction, _setRegistry } from './transaction.js';

// ─── Concrete transaction imports ────────────────────────────────────
import { PaymentTx } from './transactions/payment.js';
import { AccountSetTx } from './transactions/account-set.js';
import { AccountDeleteTx } from './transactions/account-delete.js';
import { SetRegularKeyTx } from './transactions/set-regular-key.js';
import { SignerListSetTx } from './transactions/signer-list-set.js';
import { TrustSetTx } from './transactions/trust-set.js';
import { OfferCreateTx } from './transactions/offer-create.js';
import { OfferCancelTx } from './transactions/offer-cancel.js';
import { EscrowCreateTx } from './transactions/escrow-create.js';
import { EscrowFinishTx } from './transactions/escrow-finish.js';
import { EscrowCancelTx } from './transactions/escrow-cancel.js';
import { CheckCreateTx } from './transactions/check-create.js';
import { CheckCashTx } from './transactions/check-cash.js';
import { CheckCancelTx } from './transactions/check-cancel.js';
import { NFTokenMintTx } from './transactions/nftoken-mint.js';
import { NFTokenBurnTx } from './transactions/nftoken-burn.js';
import { NFTokenCreateOfferTx } from './transactions/nftoken-create-offer.js';
import { NFTokenCancelOfferTx } from './transactions/nftoken-cancel-offer.js';
import { NFTokenAcceptOfferTx } from './transactions/nftoken-accept-offer.js';
import { NFTokenModifyTx } from './transactions/nftoken-modify.js';
import { MPTokenIssuanceCreateTx } from './transactions/mptoken-issuance-create.js';
import { MPTokenIssuanceDestroyTx } from './transactions/mptoken-issuance-destroy.js';
import { MPTokenIssuanceSetTx } from './transactions/mptoken-issuance-set.js';
import { MPTokenAuthorizeTx } from './transactions/mptoken-authorize.js';
import { PaymentChannelCreateTx } from './transactions/payment-channel-create.js';
import { PaymentChannelFundTx } from './transactions/payment-channel-fund.js';
import { PaymentChannelClaimTx } from './transactions/payment-channel-claim.js';
import { TicketCreateTx } from './transactions/ticket-create.js';
import { DepositPreauthTx } from './transactions/deposit-preauth.js';
import { ClawbackTx } from './transactions/clawback.js';
import { DelegateSetTx } from './transactions/delegate-set.js';
import { DIDSetTx } from './transactions/did-set.js';
import { DIDDeleteTx } from './transactions/did-delete.js';

// AMM
import { AMMCreateTx } from './transactions/amm-create.js';
import { AMMDepositTx } from './transactions/amm-deposit.js';
import { AMMWithdrawTx } from './transactions/amm-withdraw.js';
import { AMMVoteTx } from './transactions/amm-vote.js';
import { AMMBidTx } from './transactions/amm-bid.js';
import { AMMClawbackTx } from './transactions/amm-clawback.js';
import { AMMDeleteTx } from './transactions/amm-delete.js';

// XChain
import { XChainCreateBridgeTx } from './transactions/xchain-create-bridge.js';
import { XChainModifyBridgeTx } from './transactions/xchain-modify-bridge.js';
import { XChainCommitTx } from './transactions/xchain-commit.js';
import { XChainClaimTx } from './transactions/xchain-claim.js';
import { XChainAccountCreateCommitTx } from './transactions/xchain-account-create-commit.js';
import { XChainCreateClaimIDTx } from './transactions/xchain-create-claim-id.js';
import { XChainAddClaimAttestationTx } from './transactions/xchain-add-claim-attestation.js';
import { XChainAddAccountCreateAttestationTx } from './transactions/xchain-add-account-create-attestation.js';

// Vaults
import { VaultCreateTx } from './transactions/vault-create.js';
import { VaultDepositTx } from './transactions/vault-deposit.js';
import { VaultWithdrawTx } from './transactions/vault-withdraw.js';
import { VaultSetTx } from './transactions/vault-set.js';
import { VaultDeleteTx } from './transactions/vault-delete.js';
import { VaultClawbackTx } from './transactions/vault-clawback.js';

// Loans
import { LoanSetTx } from './transactions/loan-set.js';
import { LoanDeleteTx } from './transactions/loan-delete.js';
import { LoanManageTx } from './transactions/loan-manage.js';
import { LoanPayTx } from './transactions/loan-pay.js';
import { LoanBrokerSetTx } from './transactions/loan-broker-set.js';
import { LoanBrokerDeleteTx } from './transactions/loan-broker-delete.js';
import { LoanBrokerCoverClawbackTx } from './transactions/loan-broker-cover-clawback.js';
import { LoanBrokerCoverDepositTx } from './transactions/loan-broker-cover-deposit.js';
import { LoanBrokerCoverWithdrawTx } from './transactions/loan-broker-cover-withdraw.js';

// Credentials
import { CredentialCreateTx } from './transactions/credential-create.js';
import { CredentialAcceptTx } from './transactions/credential-accept.js';
import { CredentialDeleteTx } from './transactions/credential-delete.js';

// Oracles
import { OracleSetTx } from './transactions/oracle-set.js';
import { OracleDeleteTx } from './transactions/oracle-delete.js';

// Permissioned Domain
import { PermissionedDomainSetTx } from './transactions/permissioned-domain-set.js';
import { PermissionedDomainDeleteTx } from './transactions/permissioned-domain-delete.js';

// Batch
import { BatchTx } from './transactions/batch.js';

// ─── Registry map ────────────────────────────────────────────────────

type TransactionConstructor = new (props: Record<string, unknown>) => Transaction;

const registryMap: Partial<Record<TransactionType, TransactionConstructor>> = {
  // Account management
  AccountSet: AccountSetTx as unknown as TransactionConstructor,
  AccountDelete: AccountDeleteTx as unknown as TransactionConstructor,
  SetRegularKey: SetRegularKeyTx as unknown as TransactionConstructor,
  SignerListSet: SignerListSetTx as unknown as TransactionConstructor,
  DelegateSet: DelegateSetTx as unknown as TransactionConstructor,
  DepositPreauth: DepositPreauthTx as unknown as TransactionConstructor,
  TicketCreate: TicketCreateTx as unknown as TransactionConstructor,
  Clawback: ClawbackTx as unknown as TransactionConstructor,

  // Payments & value transfer
  Payment: PaymentTx as unknown as TransactionConstructor,
  CheckCreate: CheckCreateTx as unknown as TransactionConstructor,
  CheckCash: CheckCashTx as unknown as TransactionConstructor,
  CheckCancel: CheckCancelTx as unknown as TransactionConstructor,
  EscrowCreate: EscrowCreateTx as unknown as TransactionConstructor,
  EscrowFinish: EscrowFinishTx as unknown as TransactionConstructor,
  EscrowCancel: EscrowCancelTx as unknown as TransactionConstructor,
  PaymentChannelCreate: PaymentChannelCreateTx as unknown as TransactionConstructor,
  PaymentChannelFund: PaymentChannelFundTx as unknown as TransactionConstructor,
  PaymentChannelClaim: PaymentChannelClaimTx as unknown as TransactionConstructor,

  // DEX offers
  OfferCreate: OfferCreateTx as unknown as TransactionConstructor,
  OfferCancel: OfferCancelTx as unknown as TransactionConstructor,

  // Trust lines
  TrustSet: TrustSetTx as unknown as TransactionConstructor,

  // NFTokens
  NFTokenMint: NFTokenMintTx as unknown as TransactionConstructor,
  NFTokenBurn: NFTokenBurnTx as unknown as TransactionConstructor,
  NFTokenCreateOffer: NFTokenCreateOfferTx as unknown as TransactionConstructor,
  NFTokenCancelOffer: NFTokenCancelOfferTx as unknown as TransactionConstructor,
  NFTokenAcceptOffer: NFTokenAcceptOfferTx as unknown as TransactionConstructor,
  NFTokenModify: NFTokenModifyTx as unknown as TransactionConstructor,

  // Multi-Purpose Tokens
  MPTokenIssuanceCreate: MPTokenIssuanceCreateTx as unknown as TransactionConstructor,
  MPTokenIssuanceDestroy: MPTokenIssuanceDestroyTx as unknown as TransactionConstructor,
  MPTokenIssuanceSet: MPTokenIssuanceSetTx as unknown as TransactionConstructor,
  MPTokenAuthorize: MPTokenAuthorizeTx as unknown as TransactionConstructor,

  // AMM
  AMMCreate: AMMCreateTx as unknown as TransactionConstructor,
  AMMDeposit: AMMDepositTx as unknown as TransactionConstructor,
  AMMWithdraw: AMMWithdrawTx as unknown as TransactionConstructor,
  AMMVote: AMMVoteTx as unknown as TransactionConstructor,
  AMMBid: AMMBidTx as unknown as TransactionConstructor,
  AMMClawback: AMMClawbackTx as unknown as TransactionConstructor,
  AMMDelete: AMMDeleteTx as unknown as TransactionConstructor,

  // XChain
  XChainCreateBridge: XChainCreateBridgeTx as unknown as TransactionConstructor,
  XChainModifyBridge: XChainModifyBridgeTx as unknown as TransactionConstructor,
  XChainCommit: XChainCommitTx as unknown as TransactionConstructor,
  XChainClaim: XChainClaimTx as unknown as TransactionConstructor,
  XChainAccountCreateCommit: XChainAccountCreateCommitTx as unknown as TransactionConstructor,
  XChainCreateClaimID: XChainCreateClaimIDTx as unknown as TransactionConstructor,
  XChainAddClaimAttestation: XChainAddClaimAttestationTx as unknown as TransactionConstructor,
  XChainAddAccountCreateAttestation: XChainAddAccountCreateAttestationTx as unknown as TransactionConstructor,

  // Vaults
  VaultCreate: VaultCreateTx as unknown as TransactionConstructor,
  VaultDeposit: VaultDepositTx as unknown as TransactionConstructor,
  VaultWithdraw: VaultWithdrawTx as unknown as TransactionConstructor,
  VaultSet: VaultSetTx as unknown as TransactionConstructor,
  VaultDelete: VaultDeleteTx as unknown as TransactionConstructor,
  VaultClawback: VaultClawbackTx as unknown as TransactionConstructor,

  // Loans
  LoanSet: LoanSetTx as unknown as TransactionConstructor,
  LoanDelete: LoanDeleteTx as unknown as TransactionConstructor,
  LoanManage: LoanManageTx as unknown as TransactionConstructor,
  LoanPay: LoanPayTx as unknown as TransactionConstructor,
  LoanBrokerSet: LoanBrokerSetTx as unknown as TransactionConstructor,
  LoanBrokerDelete: LoanBrokerDeleteTx as unknown as TransactionConstructor,
  LoanBrokerCoverClawback: LoanBrokerCoverClawbackTx as unknown as TransactionConstructor,
  LoanBrokerCoverDeposit: LoanBrokerCoverDepositTx as unknown as TransactionConstructor,
  LoanBrokerCoverWithdraw: LoanBrokerCoverWithdrawTx as unknown as TransactionConstructor,

  // Credentials
  CredentialCreate: CredentialCreateTx as unknown as TransactionConstructor,
  CredentialAccept: CredentialAcceptTx as unknown as TransactionConstructor,
  CredentialDelete: CredentialDeleteTx as unknown as TransactionConstructor,

  // Oracles
  OracleSet: OracleSetTx as unknown as TransactionConstructor,
  OracleDelete: OracleDeleteTx as unknown as TransactionConstructor,

  // Permissioned Domain
  PermissionedDomainSet: PermissionedDomainSetTx as unknown as TransactionConstructor,
  PermissionedDomainDelete: PermissionedDomainDeleteTx as unknown as TransactionConstructor,

  // Batch
  Batch: BatchTx as unknown as TransactionConstructor,

  // DID
  DIDSet: DIDSetTx as unknown as TransactionConstructor,
  DIDDelete: DIDDeleteTx as unknown as TransactionConstructor,
};

// ─── Registry API ────────────────────────────────────────────────────

export class TransactionRegistry {
  static get(type: TransactionType): TransactionConstructor | undefined {
    return registryMap[type];
  }

  static register(type: TransactionType, ctor: TransactionConstructor): void {
    registryMap[type] = ctor;
  }

  static has(type: TransactionType): boolean {
    return type in registryMap;
  }

  static types(): TransactionType[] {
    return Object.keys(registryMap) as TransactionType[];
  }
}

// ─── Wire up synchronous registry access on Transaction base ─────────
_setRegistry(TransactionRegistry);
