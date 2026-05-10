/**
 * MPTokenAuthorize transaction — authorize or deauthorize an account to hold an MPT.
 *
 * @see https://xrpl.org/mptokenauthorize.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { MPTokenAuthorizeFlagsInterface } from '../types/flags.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString, isAccount } from '../validation/helpers.js';

export interface MPTokenAuthorizeTxFields extends BaseTransactionFields {
  readonly TransactionType: 'MPTokenAuthorize';
  /** The unique identifier of the MPT issuance. */
  readonly MPTokenIssuanceID: string;
  /** The account of the holder to authorize. */
  readonly Holder?: string;
  /** Bit-flags for this transaction. */
  readonly Flags?: number | MPTokenAuthorizeFlagsInterface;
}

export class MPTokenAuthorizeTx extends TokenTransaction {
  override readonly TransactionType = 'MPTokenAuthorize' as const;

  /** The unique identifier of the MPT issuance. */
  readonly MPTokenIssuanceID: string = undefined as any;

  /** The account of the holder to authorize. */
  readonly Holder?: string = undefined;
  declare readonly Flags?: number | MPTokenAuthorizeFlagsInterface;

  constructor(props: MPTokenAuthorizeTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'MPTokenAuthorize' } as BaseTransactionFields);
    this.MPTokenIssuanceID = p['MPTokenIssuanceID'] as string;
    assignDefined(this, p, ['Holder', 'Flags']);
  }

  override affectsTokenBalance(): boolean { return true; }

  override validate(): void {
    super.validate();
    if (!isString(this.MPTokenIssuanceID))
      throw new ValidationError('MPTokenAuthorize: missing MPTokenIssuanceID');
    if (this.Holder !== undefined && !isAccount(this.Holder))
      throw new ValidationError('MPTokenAuthorize: invalid Holder');
  }
}
