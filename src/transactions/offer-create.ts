/**
 * OfferCreate transaction — create a DEX limit order.
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import type { OfferCreateFlagsInterface } from '../types/flags.js';
import { OfferCreateFlags } from '../types/flags.js';
import { OfferTransaction } from '../groups/offer.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isNumber, isDomainID, isFlagEnabled } from '../validation/helpers.js';

export interface OfferCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'OfferCreate';
  readonly TakerGets: Amount;
  readonly TakerPays: Amount;
  readonly Expiration?: number;
  readonly OfferSequence?: number;
  readonly DomainID?: string;
  readonly Flags?: number | OfferCreateFlagsInterface;
}

export class OfferCreateTx extends OfferTransaction {
  override readonly TransactionType = 'OfferCreate' as const;
  readonly TakerGets!: Amount;
  readonly TakerPays!: Amount;
  readonly Expiration?: number;
  readonly OfferSequence?: number;
  readonly DomainID?: string;
  declare readonly Flags?: number | OfferCreateFlagsInterface;

  constructor(props: OfferCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'OfferCreate' } as BaseTransactionFields);
    this.TakerGets = p['TakerGets'] as Amount;
    this.TakerPays = p['TakerPays'] as Amount;
    assignDefined(this, p, ['Expiration', 'OfferSequence', 'DomainID', 'Flags']);
  }

  override validate(): void {
    super.validate();
    if (this.TakerGets === undefined)
      throw new ValidationError('OfferCreate: missing field TakerGets');
    if (!isAmount(this.TakerGets))
      throw new ValidationError('OfferCreate: invalid TakerGets');
    if (this.TakerPays === undefined)
      throw new ValidationError('OfferCreate: missing field TakerPays');
    if (!isAmount(this.TakerPays))
      throw new ValidationError('OfferCreate: invalid TakerPays');
    if (this.Expiration !== undefined && !isNumber(this.Expiration))
      throw new ValidationError('OfferCreate: invalid Expiration');
    if (this.OfferSequence !== undefined && !isNumber(this.OfferSequence))
      throw new ValidationError('OfferCreate: invalid OfferSequence');
    if (this.DomainID !== undefined && !isDomainID(this.DomainID))
      throw new ValidationError('OfferCreate: invalid DomainID');
    if (this.DomainID == null && this.hasHybridFlag())
      throw new ValidationError('OfferCreate: tfHybrid flag cannot be set if DomainID is not present');
  }

  private hasHybridFlag(): boolean {
    if (this.Flags == null) return false;
    if (typeof this.Flags === 'number') return isFlagEnabled(this.Flags, OfferCreateFlags.tfHybrid);
    return this.Flags.tfHybrid ?? false;
  }
}
