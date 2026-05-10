/**
 * OfferCreate transaction — place a limit order on the Decentralized Exchange (DEX).
 *
 * @see https://xrpl.org/offercreate.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import type { OfferCreateFlagsInterface } from '../types/flags.js';
import { OfferTransaction } from '../groups/offer.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isString } from '../validation/helpers.js';

export interface OfferCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'OfferCreate';
  /** The amount to deliver to the order book. */
  readonly TakerGets: Amount;
  /** The amount requested in exchange. */
  readonly TakerPays: Amount;
  /** Time after which the offer is no longer valid. */
  readonly Expiration?: number;
  /** Offer sequence to cancel when placing this one. */
  readonly OfferSequence?: number;
  /** Identifier for a domain (required for tfHybrid). */
  readonly DomainID?: string;
  /** Bit-flags for this transaction. */
  readonly Flags?: number | OfferCreateFlagsInterface;
}

export class OfferCreateTx extends OfferTransaction {
  override readonly TransactionType = 'OfferCreate' as const;

  /** The amount to deliver to the order book. */
  readonly TakerGets: Amount = undefined as any;

  /** The amount requested in exchange. */
  readonly TakerPays: Amount = undefined as any;

  readonly Expiration?: number = undefined;
  readonly OfferSequence?: number = undefined;
  readonly DomainID?: string = undefined;
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
    if (!isAmount(this.TakerGets)) throw new ValidationError('OfferCreate: missing or invalid TakerGets');
    if (!isAmount(this.TakerPays)) throw new ValidationError('OfferCreate: missing or invalid TakerPays');
    
    // Check tfHybrid validation
    const flags = this.Flags as any;
    const isHybrid = flags?.tfHybrid || flags === 0x00400000;
    if (isHybrid && !this.DomainID) {
      throw new ValidationError('OfferCreate: tfHybrid requires DomainID');
    }
    if (this.DomainID && !isString(this.DomainID)) {
      throw new ValidationError('OfferCreate: DomainID must be a string');
    }
  }
}
