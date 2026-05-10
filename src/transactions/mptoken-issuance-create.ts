/**
 * MPTokenIssuanceCreate transaction — create a new Multi-Purpose Token (MPT) issuance.
 *
 * @see https://xrpl.org/mptokenissuancecreate.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString, isNumber } from '../validation/helpers.js';

export interface MPTokenIssuanceCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'MPTokenIssuanceCreate';
  /** The maximum amount of tokens that can be issued. */
  readonly MaximumAmount?: string;
  /** The asset scale for the token (0-15). */
  readonly AssetScale?: number;
  /** The transfer fee for the token (0-50,000 basis points). */
  readonly TransferFee?: number;
  /** Arbitrary metadata for the issuance. */
  readonly MPTokenMetadata?: string;
}

export class MPTokenIssuanceCreateTx extends TokenTransaction {
  override readonly TransactionType = 'MPTokenIssuanceCreate' as const;

  readonly MaximumAmount?: string = undefined;
  readonly AssetScale?: number = undefined;
  readonly TransferFee?: number = undefined;
  readonly MPTokenMetadata?: string = undefined;

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
