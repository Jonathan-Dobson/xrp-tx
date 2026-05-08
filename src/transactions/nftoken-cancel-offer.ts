/**
 * NFTokenCancelOffer transaction — cancel one or more NFToken offers.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { TokenTransaction } from '../groups/token.js';
import { ValidationError } from '../errors.js';
import { isArray, isString } from '../validation/helpers.js';

export interface NFTokenCancelOfferTxFields extends BaseTransactionFields {
  readonly TransactionType: 'NFTokenCancelOffer';
  readonly NFTokenOffers: string[];
}

export class NFTokenCancelOfferTx extends TokenTransaction {
  override readonly TransactionType = 'NFTokenCancelOffer' as const;
  readonly NFTokenOffers!: string[];

  constructor(props: NFTokenCancelOfferTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'NFTokenCancelOffer' } as BaseTransactionFields);
    this.NFTokenOffers = p['NFTokenOffers'] as string[];
  }

  override affectsTokenBalance(): boolean { return false; }

  override validate(): void {
    super.validate();
    if (!isArray(this.NFTokenOffers) || this.NFTokenOffers.length === 0)
      throw new ValidationError('NFTokenCancelOffer: missing or empty NFTokenOffers');
    if (!this.NFTokenOffers.every(isString))
      throw new ValidationError('NFTokenCancelOffer: NFTokenOffers must be strings');
  }
}
