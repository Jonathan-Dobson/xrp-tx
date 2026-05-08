/**
 * LoanBrokerCoverWithdraw transaction — withdraw funds from loan broker cover.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { LoanTransaction } from '../groups/loan.js';
import { ValidationError } from '../errors.js';
import { isAmount, isAccount } from '../validation/helpers.js';

export interface LoanBrokerCoverWithdrawTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanBrokerCoverWithdraw';
  readonly Broker: string;
  readonly Amount: Amount;
}

export class LoanBrokerCoverWithdrawTx extends LoanTransaction {
  override readonly TransactionType = 'LoanBrokerCoverWithdraw' as const;
  readonly Broker!: string;
  readonly Amount!: Amount;

  constructor(props: LoanBrokerCoverWithdrawTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanBrokerCoverWithdraw' } as BaseTransactionFields);
    this.Broker = p['Broker'] as string;
    this.Amount = p['Amount'] as Amount;
  }

  override validate(): void {
    super.validate();
    if (!isAccount(this.Broker))
      throw new ValidationError('LoanBrokerCoverWithdraw: invalid Broker');
    if (!isAmount(this.Amount))
      throw new ValidationError('LoanBrokerCoverWithdraw: invalid Amount');
  }
}
