/**
 * EscrowFinish transaction — release a held payment.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount, isNumber, isString } from '../validation/helpers.js';

export interface EscrowFinishTxFields extends BaseTransactionFields {
  readonly TransactionType: 'EscrowFinish';
  readonly Owner: string;
  readonly OfferSequence: number;
  readonly Condition?: string;
  readonly Fulfillment?: string;
}

export class EscrowFinishTx extends Transaction {
  override readonly TransactionType = 'EscrowFinish' as const;
  readonly Owner!: string;
  readonly OfferSequence!: number;
  readonly Condition?: string;
  readonly Fulfillment?: string;

  constructor(props: EscrowFinishTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'EscrowFinish' } as BaseTransactionFields);
    this.Owner = p['Owner'] as string;
    this.OfferSequence = p['OfferSequence'] as number;
    assignDefined(this, p, ['Condition', 'Fulfillment']);
  }

  override validate(): void {
    super.validate();
    if (!isAccount(this.Owner)) throw new ValidationError('EscrowFinish: invalid Owner');
    if (!isNumber(this.OfferSequence)) throw new ValidationError('EscrowFinish: invalid OfferSequence');
    if (this.Condition !== undefined && !isString(this.Condition))
      throw new ValidationError('EscrowFinish: Condition must be a string');
    if (this.Fulfillment !== undefined && !isString(this.Fulfillment))
      throw new ValidationError('EscrowFinish: Fulfillment must be a string');
  }
}
