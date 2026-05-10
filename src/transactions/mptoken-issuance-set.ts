/**
 * MPTokenIssuanceSet transaction — update the flags or metadata of an MPT issuance.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString } from '../validation/helpers.js';

export interface MPTokenIssuanceSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'MPTokenIssuanceSet';
  /** The unique identifier of the MPT issuance. */
  readonly MPTokenIssuanceID: string;
  /** The account of the holder to update (for specific flags). */
  readonly Holder?: string;
}

export class MPTokenIssuanceSetTx extends TokenTransaction {
  override readonly TransactionType = 'MPTokenIssuanceSet' as const;

  /** The unique identifier of the MPT issuance. */
  readonly MPTokenIssuanceID: string = undefined as any;

  /** The account of the holder to update (for specific flags). */
  readonly Holder?: string = undefined;

  constructor(props: MPTokenIssuanceSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'MPTokenIssuanceSet' } as BaseTransactionFields);
    this.MPTokenIssuanceID = p['MPTokenIssuanceID'] as string;
    assignDefined(this, p, ['Holder']);
  }

  override affectsTokenBalance(): boolean { return false; }

  override validate(): void {
    super.validate();
    if (!isString(this.MPTokenIssuanceID)) {
      throw new ValidationError('MPTokenIssuanceSet: missing or invalid MPTokenIssuanceID');
    }
  }
}
