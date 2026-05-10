/**
 * LoanBrokerCoverWithdraw transaction — withdraw coverage assets from a loan broker account.
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount } from '../validation/helpers.js';

export interface LoanBrokerCoverWithdrawTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanBrokerCoverWithdraw';
  /** The amount to withdraw. */
  readonly Amount: Amount;
}

export class LoanBrokerCoverWithdrawTx extends Transaction {
  override readonly TransactionType = 'LoanBrokerCoverWithdraw' as const;

  readonly Amount: Amount = undefined as any;

  constructor(props: LoanBrokerCoverWithdrawTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanBrokerCoverWithdraw' } as BaseTransactionFields);
    this.Amount = p['Amount'] as Amount;
  }

  override validate(): void {
    super.validate();
    if (!isAmount(this.Amount)) throw new ValidationError('LoanBrokerCoverWithdraw: missing or invalid Amount');
  }
}
