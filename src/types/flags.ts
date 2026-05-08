/**
 * Flag enums and interfaces for all XRPL transaction types.
 *
 * Each transaction type that supports flags gets:
 * 1. A numeric enum for bitwise flag values
 * 2. A boolean-map interface for developer-friendly usage
 */

// ─── Global ──────────────────────────────────────────────────────────

export enum GlobalFlags {
  tfInnerBatchTxn = 0x40000000,
}

export interface GlobalFlagsInterface {
  tfInnerBatchTxn?: boolean;
}

// ─── Payment ─────────────────────────────────────────────────────────

export enum PaymentFlags {
  tfNoRippleDirect = 0x00010000,
  tfPartialPayment = 0x00020000,
  tfLimitQuality = 0x00040000,
}

export interface PaymentFlagsInterface extends GlobalFlagsInterface {
  tfNoRippleDirect?: boolean;
  tfPartialPayment?: boolean;
  tfLimitQuality?: boolean;
}

// ─── AccountSet ──────────────────────────────────────────────────────

export enum AccountSetAsfFlags {
  asfRequireDest = 1,
  asfRequireAuth = 2,
  asfDisallowXRP = 3,
  asfDisableMaster = 4,
  asfAccountTxnID = 5,
  asfNoFreeze = 6,
  asfGlobalFreeze = 7,
  asfDefaultRipple = 8,
  asfDepositAuth = 9,
  asfAuthorizedNFTokenMinter = 10,
  asfDisallowIncomingNFTokenOffer = 12,
  asfDisallowIncomingCheck = 13,
  asfDisallowIncomingPayChan = 14,
  asfDisallowIncomingTrustline = 15,
  asfAllowTrustLineClawback = 16,
  asfAllowTrustLineLocking = 17,
}

export enum AccountSetTfFlags {
  tfRequireDestTag = 0x00010000,
  tfOptionalDestTag = 0x00020000,
  tfRequireAuth = 0x00040000,
  tfOptionalAuth = 0x00080000,
  tfDisallowXRP = 0x00100000,
  tfAllowXRP = 0x00200000,
}

export interface AccountSetFlagsInterface extends GlobalFlagsInterface {
  tfRequireDestTag?: boolean;
  tfOptionalDestTag?: boolean;
  tfRequireAuth?: boolean;
  tfOptionalAuth?: boolean;
  tfDisallowXRP?: boolean;
  tfAllowXRP?: boolean;
}

// ─── TrustSet ────────────────────────────────────────────────────────

export enum TrustSetFlags {
  tfSetfAuth = 0x00010000,
  tfSetNoRipple = 0x00020000,
  tfClearNoRipple = 0x00040000,
  tfSetFreeze = 0x00100000,
  tfClearFreeze = 0x00200000,
  tfSetDeepFreeze = 0x00400000,
  tfClearDeepFreeze = 0x00800000,
}

export interface TrustSetFlagsInterface extends GlobalFlagsInterface {
  tfSetfAuth?: boolean;
  tfSetNoRipple?: boolean;
  tfClearNoRipple?: boolean;
  tfSetFreeze?: boolean;
  tfClearFreeze?: boolean;
  tfSetDeepFreeze?: boolean;
  tfClearDeepFreeze?: boolean;
}

// ─── OfferCreate ─────────────────────────────────────────────────────

export enum OfferCreateFlags {
  tfPassive = 0x00010000,
  tfImmediateOrCancel = 0x00020000,
  tfFillOrKill = 0x00040000,
  tfSell = 0x00080000,
  tfHybrid = 0x00100000,
}

export interface OfferCreateFlagsInterface extends GlobalFlagsInterface {
  tfPassive?: boolean;
  tfImmediateOrCancel?: boolean;
  tfFillOrKill?: boolean;
  tfSell?: boolean;
  tfHybrid?: boolean;
}

// ─── NFTokenMint ─────────────────────────────────────────────────────

export enum NFTokenMintFlags {
  tfBurnable = 0x00000001,
  tfOnlyXRP = 0x00000002,
  tfTrustLine = 0x00000004,
  tfTransferable = 0x00000008,
}

export interface NFTokenMintFlagsInterface extends GlobalFlagsInterface {
  tfBurnable?: boolean;
  tfOnlyXRP?: boolean;
  tfTrustLine?: boolean;
  tfTransferable?: boolean;
}

// ─── NFTokenCreateOffer ──────────────────────────────────────────────

export enum NFTokenCreateOfferFlags {
  tfSellNFToken = 0x00000001,
}

export interface NFTokenCreateOfferFlagsInterface extends GlobalFlagsInterface {
  tfSellNFToken?: boolean;
}

// ─── PaymentChannelClaim ─────────────────────────────────────────────

export enum PaymentChannelClaimFlags {
  tfRenew = 0x00010000,
  tfClose = 0x00020000,
}

export interface PaymentChannelClaimFlagsInterface extends GlobalFlagsInterface {
  tfRenew?: boolean;
  tfClose?: boolean;
}

// ─── AMMDeposit ──────────────────────────────────────────────────────

export enum AMMDepositFlags {
  tfLPToken = 0x00010000,
  tfSingleAsset = 0x00080000,
  tfTwoAsset = 0x00100000,
  tfOneAssetLPToken = 0x00200000,
  tfLimitLPToken = 0x00400000,
  tfTwoAssetIfEmpty = 0x00800000,
}

export interface AMMDepositFlagsInterface extends GlobalFlagsInterface {
  tfLPToken?: boolean;
  tfSingleAsset?: boolean;
  tfTwoAsset?: boolean;
  tfOneAssetLPToken?: boolean;
  tfLimitLPToken?: boolean;
  tfTwoAssetIfEmpty?: boolean;
}

// ─── AMMWithdraw ─────────────────────────────────────────────────────

export enum AMMWithdrawFlags {
  tfLPToken = 0x00010000,
  tfWithdrawAll = 0x00020000,
  tfOneAssetWithdrawAll = 0x00040000,
  tfSingleAsset = 0x00080000,
  tfTwoAsset = 0x00100000,
  tfOneAssetLPToken = 0x00200000,
  tfLimitLPToken = 0x00400000,
}

export interface AMMWithdrawFlagsInterface extends GlobalFlagsInterface {
  tfLPToken?: boolean;
  tfWithdrawAll?: boolean;
  tfOneAssetWithdrawAll?: boolean;
  tfSingleAsset?: boolean;
  tfTwoAsset?: boolean;
  tfOneAssetLPToken?: boolean;
  tfLimitLPToken?: boolean;
}

// ─── MPTokenAuthorize ────────────────────────────────────────────────

export enum MPTokenAuthorizeFlags {
  tfMPTUnauthorize = 0x00000001,
}

export interface MPTokenAuthorizeFlagsInterface extends GlobalFlagsInterface {
  tfMPTUnauthorize?: boolean;
}

// ─── Clawback ────────────────────────────────────────────────────────

export enum ClawbackFlags {
  tfClawTwoAssets = 0x00000001,
}

export interface ClawbackFlagsInterface extends GlobalFlagsInterface {
  tfClawTwoAssets?: boolean;
}

// ─── XChainModifyBridge ──────────────────────────────────────────────

export enum XChainModifyBridgeFlags {
  tfClearAccountCreateAmount = 0x00010000,
}

export interface XChainModifyBridgeFlagsInterface extends GlobalFlagsInterface {
  tfClearAccountCreateAmount?: boolean;
}

// ─── Batch ───────────────────────────────────────────────────────────

export enum BatchFlags {
  tfAllOrNothing = 0x00000001,
  tfOnlyOne = 0x00000002,
  tfUntilFailure = 0x00000004,
  tfIndependent = 0x00000008,
}

export interface BatchFlagsInterface extends GlobalFlagsInterface {
  tfAllOrNothing?: boolean;
  tfOnlyOne?: boolean;
  tfUntilFailure?: boolean;
  tfIndependent?: boolean;
}
