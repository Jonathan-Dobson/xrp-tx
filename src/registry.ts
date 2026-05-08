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
