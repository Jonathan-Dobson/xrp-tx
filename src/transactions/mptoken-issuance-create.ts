/**
 * MPTokenIssuanceCreate transaction — create a new Multi-Purpose Token issuance.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString, isNumber } from '../validation/helpers.js';

export interface MPTokenIssuanceCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'MPTokenIssuanceCreate';
  readonly MaximumAmount?: string;
  readonly AssetScale?: number;
  readonly TransferFee?: number;
  readonly MPTokenMetadata?: string;
}

export class MPTokenIssuanceCreateTx extends TokenTransaction {
  override readonly TransactionType = 'MPTokenIssuanceCreate' as const;
  readonly MaximumAmount?: string;
  readonly AssetScale?: number;
  readonly TransferFee?: number;
  readonly MPTokenMetadata?: string;

  constructor(props: MPTokenIssuanceCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'MPTokenIssuanceCreate' } as BaseTransactionFields);
    assignDefined(this, p, ['MaximumAmount', 'AssetScale', 'TransferFee', 'MPTokenMetadata']);
  }

  override affectsTokenBalance(): boolean { return false; }

  override validate(): void {
    super.validate();
    if (this.MaximumAmount !== undefined && !isString(this.MaximumAmount))
      throw new ValidationError('MPTokenIssuanceCreate: MaximumAmount must be a string');
    if (this.AssetScale !== undefined && !isNumber(this.AssetScale))
      throw new ValidationError('MPTokenIssuanceCreate: AssetScale must be a number');
    if (this.TransferFee !== undefined && !isNumber(this.TransferFee))
      throw new ValidationError('MPTokenIssuanceCreate: TransferFee must be a number');
    if (this.MPTokenMetadata !== undefined && !isString(this.MPTokenMetadata))
      throw new ValidationError('MPTokenIssuanceCreate: MPTokenMetadata must be a string');
  }
}
