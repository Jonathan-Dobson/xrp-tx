/**
 * NFTokenCreateOffer transaction — create an offer to buy or sell an NFToken.
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import type { NFTokenCreateOfferFlagsInterface } from '../types/flags.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString, isAmount, isAccount, isNumber } from '../validation/helpers.js';

export interface NFTokenCreateOfferTxFields extends BaseTransactionFields {
  readonly TransactionType: 'NFTokenCreateOffer';
  readonly NFTokenID: string;
  readonly Amount: Amount;
  readonly Owner?: string;
  readonly Expiration?: number;
  readonly Destination?: string;
  readonly Flags?: number | NFTokenCreateOfferFlagsInterface;
}

export class NFTokenCreateOfferTx extends TokenTransaction {
  override readonly TransactionType = 'NFTokenCreateOffer' as const;
  readonly NFTokenID!: string;
  readonly Amount!: Amount;
  readonly Owner?: string;
  readonly Expiration?: number;
  readonly Destination?: string;
  declare readonly Flags?: number | NFTokenCreateOfferFlagsInterface;

  constructor(props: NFTokenCreateOfferTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'NFTokenCreateOffer' } as BaseTransactionFields);
    this.NFTokenID = p['NFTokenID'] as string;
    this.Amount = p['Amount'] as Amount;
    assignDefined(this, p, ['Owner', 'Expiration', 'Destination', 'Flags']);
  }

  override affectsTokenBalance(): boolean { return false; }

  override validate(): void {
    super.validate();
    if (!isString(this.NFTokenID))
      throw new ValidationError('NFTokenCreateOffer: missing NFTokenID');
    if (!isAmount(this.Amount))
      throw new ValidationError('NFTokenCreateOffer: invalid Amount');
    if (this.Owner !== undefined && !isAccount(this.Owner))
      throw new ValidationError('NFTokenCreateOffer: invalid Owner');
    if (this.Expiration !== undefined && !isNumber(this.Expiration))
      throw new ValidationError('NFTokenCreateOffer: Expiration must be a number');
    if (this.Destination !== undefined && !isAccount(this.Destination))
      throw new ValidationError('NFTokenCreateOffer: invalid Destination');
  }
}
