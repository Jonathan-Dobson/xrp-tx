/**
 * LoanBrokerSet transaction — create or update a loan broker.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { LoanTransaction } from '../groups/loan.js';
import { ValidationError } from '../errors.js';
import { isNumber } from '../validation/helpers.js';

export interface LoanBrokerSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanBrokerSet';
  readonly FeeRate: number;
}

export class LoanBrokerSetTx extends LoanTransaction {
  override readonly TransactionType = 'LoanBrokerSet' as const;
  readonly FeeRate!: number;

  constructor(props: LoanBrokerSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanBrokerSet' } as BaseTransactionFields);
    this.FeeRate = p['FeeRate'] as number;
  }

  override validate(): void {
    super.validate();
    if (!isNumber(this.FeeRate))
      throw new ValidationError('LoanBrokerSet: missing FeeRate');
  }
}
