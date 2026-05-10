/**
 * NFTokenMint transaction — create a new NFToken (NFT) on the ledger.
 *
 * @see https://xrpl.org/nftokenmint.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { NFTokenMintFlagsInterface } from '../types/flags.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isNumber, isString, isAccount } from '../validation/helpers.js';

export interface NFTokenMintTxFields extends BaseTransactionFields {
  readonly TransactionType: 'NFTokenMint';
  /** The taxon associated with this NFToken. */
  readonly NFTokenTaxon: number;
  /** The address of the entity that created the token (if not the sender). */
  readonly Issuer?: string;
  /** The fee (in basis points) charged on secondary sales (0-50,000). */
  readonly TransferFee?: number;
  /** Arbitrary data for the token (e.g. IPFS link). */
  readonly URI?: string;
  /** Bit-flags for this transaction. */
  readonly Flags?: number | NFTokenMintFlagsInterface;
}

export class NFTokenMintTx extends TokenTransaction {
  override readonly TransactionType = 'NFTokenMint' as const;

  /** The taxon associated with this NFToken. */
  readonly NFTokenTaxon: number = undefined as any;

  readonly Issuer?: string = undefined;
  readonly TransferFee?: number = undefined;
  readonly URI?: string = undefined;
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
