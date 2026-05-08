/**
 * LoanDelete transaction — delete a loan specification.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { LoanTransaction } from '../groups/loan.js';
import { ValidationError } from '../errors.js';

export interface LoanDeleteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanDelete';
  readonly LoanID: string;
}

export class LoanDeleteTx extends LoanTransaction {
  override readonly TransactionType = 'LoanDelete' as const;
  readonly LoanID!: string;

  constructor(props: LoanDeleteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanDelete' } as BaseTransactionFields);
    this.LoanID = p['LoanID'] as string;
  }

  override validate(): void {
    super.validate();
    if (typeof this.LoanID !== 'string')
      throw new ValidationError('LoanDelete: LoanID must be a string');
  }
}
