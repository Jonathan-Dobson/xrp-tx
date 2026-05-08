/**
 * LoanManage transaction — manage an active loan.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { LoanTransaction } from '../groups/loan.js';
import { ValidationError } from '../errors.js';

export interface LoanManageTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanManage';
  readonly LoanID: string;
  readonly Action: string;
}

export class LoanManageTx extends LoanTransaction {
  override readonly TransactionType = 'LoanManage' as const;
  readonly LoanID!: string;
  readonly Action!: string;

  constructor(props: LoanManageTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanManage' } as BaseTransactionFields);
    this.LoanID = p['LoanID'] as string;
    this.Action = p['Action'] as string;
  }

  override validate(): void {
    super.validate();
    if (typeof this.LoanID !== 'string')
      throw new ValidationError('LoanManage: LoanID must be a string');
    if (typeof this.Action !== 'string')
      throw new ValidationError('LoanManage: Action must be a string');
  }
}
