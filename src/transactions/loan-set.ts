/**
 * LoanSet transaction — create or update a loan specification.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { LoanTransaction } from '../groups/loan.js';
import { ValidationError } from '../errors.js';
import { isAmount, isNumber } from '../validation/helpers.js';

export interface LoanSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanSet';
  readonly LoanID: string;
  readonly Amount: Amount;
  readonly InterestRate: number;
  readonly Term: number;
}

export class LoanSetTx extends LoanTransaction {
  override readonly TransactionType = 'LoanSet' as const;
  readonly LoanID!: string;
  readonly Amount!: Amount;
  readonly InterestRate!: number;
  readonly Term!: number;

  constructor(props: LoanSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanSet' } as BaseTransactionFields);
    this.LoanID = p['LoanID'] as string;
    this.Amount = p['Amount'] as Amount;
    this.InterestRate = p['InterestRate'] as number;
    this.Term = p['Term'] as number;
  }

  override validate(): void {
    super.validate();
    if (typeof this.LoanID !== 'string')
      throw new ValidationError('LoanSet: LoanID must be a string');
    if (!isAmount(this.Amount))
      throw new ValidationError('LoanSet: invalid Amount');
    if (!isNumber(this.InterestRate))
      throw new ValidationError('LoanSet: missing InterestRate');
    if (!isNumber(this.Term))
      throw new ValidationError('LoanSet: missing Term');
  }
}
