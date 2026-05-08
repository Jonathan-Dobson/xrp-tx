/**
 * NFTokenMint transaction — mint a new NFToken.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { NFTokenMintFlagsInterface } from '../types/flags.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isNumber, isString, isAccount } from '../validation/helpers.js';

export interface NFTokenMintTxFields extends BaseTransactionFields {
  readonly TransactionType: 'NFTokenMint';
  readonly NFTokenTaxon: number;
  readonly Issuer?: string;
  readonly TransferFee?: number;
  readonly URI?: string;
  readonly Flags?: number | NFTokenMintFlagsInterface;
}

export class NFTokenMintTx extends TokenTransaction {
  override readonly TransactionType = 'NFTokenMint' as const;
  readonly NFTokenTaxon!: number;
  readonly Issuer?: string;
  readonly TransferFee?: number;
  readonly URI?: string;
  declare readonly Flags?: number | NFTokenMintFlagsInterface;

  constructor(props: NFTokenMintTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'NFTokenMint' } as BaseTransactionFields);
    this.NFTokenTaxon = p['NFTokenTaxon'] as number;
    assignDefined(this, p, ['Issuer', 'TransferFee', 'URI', 'Flags']);
  }

  override affectsTokenBalance(): boolean { return true; }

  override validate(): void {
    super.validate();
    if (!isNumber(this.NFTokenTaxon))
      throw new ValidationError('NFTokenMint: missing or invalid NFTokenTaxon');
    if (this.Issuer !== undefined && !isAccount(this.Issuer))
      throw new ValidationError('NFTokenMint: invalid Issuer');
    if (this.TransferFee !== undefined) {
      if (!isNumber(this.TransferFee))
        throw new ValidationError('NFTokenMint: TransferFee must be a number');
      if (this.TransferFee < 0 || this.TransferFee > 50000)
        throw new ValidationError('NFTokenMint: TransferFee must be 0-50000');
    }
    if (this.URI !== undefined && !isString(this.URI))
      throw new ValidationError('NFTokenMint: URI must be a string');
  }
}
