/**
 * LoanBrokerDelete transaction — delete a loan broker definition.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction } from '../transaction.js';

export interface LoanBrokerDeleteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanBrokerDelete';
}

export class LoanBrokerDeleteTx extends Transaction {
  override readonly TransactionType = 'LoanBrokerDelete' as const;

  constructor(props: LoanBrokerDeleteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanBrokerDelete' } as BaseTransactionFields);
  }

  override validate(): void {
    super.validate();
  }
}
