/**
 * LoanBrokerCoverDeposit transaction — deposit coverage assets into a loan broker account.
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount } from '../validation/helpers.js';

export interface LoanBrokerCoverDepositTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanBrokerCoverDeposit';
  /** The amount to deposit. */
  readonly Amount: Amount;
}

export class LoanBrokerCoverDepositTx extends Transaction {
  override readonly TransactionType = 'LoanBrokerCoverDeposit' as const;

  readonly Amount: Amount = undefined as any;

  constructor(props: LoanBrokerCoverDepositTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanBrokerCoverDeposit' } as BaseTransactionFields);
    this.Amount = p['Amount'] as Amount;
  }

  override validate(): void {
    super.validate();
    if (!isAmount(this.Amount)) throw new ValidationError('LoanBrokerCoverDeposit: missing or invalid Amount');
  }
}
