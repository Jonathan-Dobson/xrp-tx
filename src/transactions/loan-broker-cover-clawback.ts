/**
 * LoanBrokerCoverClawback transaction — claw back loan broker cover.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { LoanTransaction } from '../groups/loan.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isAccount } from '../validation/helpers.js';

export interface LoanBrokerCoverClawbackTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanBrokerCoverClawback';
  readonly Broker: string;
  readonly Amount?: Amount;
}

export class LoanBrokerCoverClawbackTx extends LoanTransaction {
  override readonly TransactionType = 'LoanBrokerCoverClawback' as const;
  readonly Broker!: string;
  readonly Amount?: Amount;

  constructor(props: LoanBrokerCoverClawbackTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanBrokerCoverClawback' } as BaseTransactionFields);
    this.Broker = p['Broker'] as string;
    assignDefined(this, p, ['Amount']);
  }

  override validate(): void {
    super.validate();
    if (!isAccount(this.Broker))
      throw new ValidationError('LoanBrokerCoverClawback: invalid Broker');
    if (this.Amount !== undefined && !isAmount(this.Amount))
      throw new ValidationError('LoanBrokerCoverClawback: invalid Amount');
  }
}
