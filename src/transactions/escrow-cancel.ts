/**
 * EscrowCancel transaction — cancel a held payment.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount, isNumber } from '../validation/helpers.js';

export interface EscrowCancelTxFields extends BaseTransactionFields {
  readonly TransactionType: 'EscrowCancel';
  readonly Owner: string;
  readonly OfferSequence: number;
}

export class EscrowCancelTx extends Transaction {
  override readonly TransactionType = 'EscrowCancel' as const;
  readonly Owner: string;
  readonly OfferSequence: number;

  constructor(props: EscrowCancelTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'EscrowCancel' } as BaseTransactionFields);
    this.Owner = p['Owner'] as string;
    this.OfferSequence = p['OfferSequence'] as number;
  }

  override validate(): void {
    super.validate();
    if (!isAccount(this.Owner)) throw new ValidationError('EscrowCancel: invalid Owner');
    if (!isNumber(this.OfferSequence)) throw new ValidationError('EscrowCancel: invalid OfferSequence');
  }
}
