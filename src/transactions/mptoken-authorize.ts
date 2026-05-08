/**
 * MPTokenAuthorize — authorize or deauthorize an MPT holder.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { MPTokenAuthorizeFlagsInterface } from '../types/flags.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString, isAccount } from '../validation/helpers.js';

export interface MPTokenAuthorizeTxFields extends BaseTransactionFields {
  readonly TransactionType: 'MPTokenAuthorize';
  readonly MPTokenIssuanceID: string;
  readonly Holder?: string;
  readonly Flags?: number | MPTokenAuthorizeFlagsInterface;
}

export class MPTokenAuthorizeTx extends TokenTransaction {
  override readonly TransactionType = 'MPTokenAuthorize' as const;
  readonly MPTokenIssuanceID!: string;
  readonly Holder?: string;
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
