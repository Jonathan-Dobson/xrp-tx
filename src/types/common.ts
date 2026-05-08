/**
 * Common supporting types used across XRPL transactions.
 */

/**
 * A Memo attached to a transaction.
 */
export interface Memo {
  readonly Memo: {
    readonly MemoData?: string;
    readonly MemoType?: string;
    readonly MemoFormat?: string;
  };
}

/**
 * A multi-signature entry.
 */
export interface Signer {
  readonly Signer: {
    readonly Account: string;
    readonly TxnSignature: string;
    readonly SigningPubKey: string;
  };
}

/**
 * A single step in a payment path.
 */
export interface PathStep {
  readonly account?: string;
  readonly currency?: string;
  readonly issuer?: string;
}

/**
 * A payment path — an array of path steps.
 */
export type Path = readonly PathStep[];

/**
 * An XChain bridge specification.
 */
export interface XChainBridge {
  readonly LockingChainDoor: string;
  readonly LockingChainIssue: { readonly currency: string; readonly issuer?: string };
  readonly IssuingChainDoor: string;
  readonly IssuingChainIssue: { readonly currency: string; readonly issuer?: string };
}

/**
 * An authorization credential reference.
 */
export interface AuthorizeCredential {
  readonly Credential: {
    readonly Issuer: string;
    readonly CredentialType: string;
  };
}

/**
 * A signer entry for SignerListSet.
 */
export interface SignerEntry {
  readonly SignerEntry: {
    readonly Account: string;
    readonly SignerWeight: number;
    readonly WalletLocator?: string;
  };
}

/**
 * Oracle data series entry.
 */
export interface OracleDataSeries {
  readonly PriceData: {
    readonly BaseAsset: string;
    readonly QuoteAsset: string;
    readonly AssetPrice?: string | number;
    readonly Scale?: number;
  };
}
