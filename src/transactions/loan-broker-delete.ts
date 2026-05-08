/**
 * LoanBrokerDelete transaction — delete a loan broker.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { LoanTransaction } from '../groups/loan.js';

export interface LoanBrokerDeleteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanBrokerDelete';
}

export class LoanBrokerDeleteTx extends LoanTransaction {
  override readonly TransactionType = 'LoanBrokerDelete' as const;

  constructor(props: LoanBrokerDeleteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanBrokerDelete' } as BaseTransactionFields);
  }
}
