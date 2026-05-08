/**
 * MPTokenIssuanceDestroy — destroy an MPT issuance.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { TokenTransaction } from '../groups/token.js';
import { ValidationError } from '../errors.js';
import { isString } from '../validation/helpers.js';

export interface MPTokenIssuanceDestroyTxFields extends BaseTransactionFields {
  readonly TransactionType: 'MPTokenIssuanceDestroy';
  readonly MPTokenIssuanceID: string;
}

export class MPTokenIssuanceDestroyTx extends TokenTransaction {
  override readonly TransactionType = 'MPTokenIssuanceDestroy' as const;
  readonly MPTokenIssuanceID!: string;

  constructor(props: MPTokenIssuanceDestroyTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'MPTokenIssuanceDestroy' } as BaseTransactionFields);
    this.MPTokenIssuanceID = p['MPTokenIssuanceID'] as string;
  }

  override affectsTokenBalance(): boolean { return true; }

  override validate(): void {
    super.validate();
    if (!isString(this.MPTokenIssuanceID))
      throw new ValidationError('MPTokenIssuanceDestroy: missing MPTokenIssuanceID');
  }
}
