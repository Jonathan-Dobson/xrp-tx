/**
 * MPTokenIssuanceSet — update properties of an MPT issuance.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString, isAccount } from '../validation/helpers.js';

export interface MPTokenIssuanceSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'MPTokenIssuanceSet';
  readonly MPTokenIssuanceID: string;
  readonly Holder?: string;
}

export class MPTokenIssuanceSetTx extends TokenTransaction {
  override readonly TransactionType = 'MPTokenIssuanceSet' as const;
  readonly MPTokenIssuanceID!: string;
  readonly Holder?: string;

  constructor(props: MPTokenIssuanceSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'MPTokenIssuanceSet' } as BaseTransactionFields);
    this.MPTokenIssuanceID = p['MPTokenIssuanceID'] as string;
    assignDefined(this, p, ['Holder']);
  }

  override affectsTokenBalance(): boolean { return false; }

  override validate(): void {
    super.validate();
    if (!isString(this.MPTokenIssuanceID))
      throw new ValidationError('MPTokenIssuanceSet: missing MPTokenIssuanceID');
    if (this.Holder !== undefined && !isAccount(this.Holder))
      throw new ValidationError('MPTokenIssuanceSet: invalid Holder');
  }
}
