/**
 * LoanBrokerCoverDeposit transaction — deposit funds into loan broker cover.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { LoanTransaction } from '../groups/loan.js';
import { ValidationError } from '../errors.js';
import { isAmount, isAccount } from '../validation/helpers.js';

export interface LoanBrokerCoverDepositTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanBrokerCoverDeposit';
  readonly Broker: string;
  readonly Amount: Amount;
}

export class LoanBrokerCoverDepositTx extends LoanTransaction {
  override readonly TransactionType = 'LoanBrokerCoverDeposit' as const;
  readonly Broker!: string;
  readonly Amount!: Amount;

  constructor(props: LoanBrokerCoverDepositTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanBrokerCoverDeposit' } as BaseTransactionFields);
    this.Broker = p['Broker'] as string;
    this.Amount = p['Amount'] as Amount;
  }

  override validate(): void {
    super.validate();
    if (!isAccount(this.Broker))
      throw new ValidationError('LoanBrokerCoverDeposit: invalid Broker');
    if (!isAmount(this.Amount))
      throw new ValidationError('LoanBrokerCoverDeposit: invalid Amount');
  }
}
