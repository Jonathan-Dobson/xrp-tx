/**
 * LoanPay transaction — make a payment towards a loan.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { LoanTransaction } from '../groups/loan.js';
import { ValidationError } from '../errors.js';
import { isAmount } from '../validation/helpers.js';

export interface LoanPayTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanPay';
  readonly LoanID: string;
  readonly Amount: Amount;
}

export class LoanPayTx extends LoanTransaction {
  override readonly TransactionType = 'LoanPay' as const;
  readonly LoanID!: string;
  readonly Amount!: Amount;

  constructor(props: LoanPayTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanPay' } as BaseTransactionFields);
    this.LoanID = p['LoanID'] as string;
    this.Amount = p['Amount'] as Amount;
  }

  override validate(): void {
    super.validate();
    if (typeof this.LoanID !== 'string')
      throw new ValidationError('LoanPay: LoanID must be a string');
    if (!isAmount(this.Amount))
      throw new ValidationError('LoanPay: invalid Amount');
  }
}
