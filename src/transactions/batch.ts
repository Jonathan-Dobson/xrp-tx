/**
 * Batch transaction — execute multiple transactions in a single atomic batch.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { BatchFlagsInterface } from '../types/flags.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isArray, isRecord } from '../validation/helpers.js';

export interface BatchTxFields extends BaseTransactionFields {
  readonly TransactionType: 'Batch';
  readonly Transactions: Array<{ readonly Transaction: Record<string, unknown> }>;
  readonly Flags?: number | BatchFlagsInterface;
}

export class BatchTx extends Transaction {
  override readonly TransactionType = 'Batch' as const;
  readonly Transactions!: Array<{ readonly Transaction: Record<string, unknown> }>;
  declare readonly Flags?: number | BatchFlagsInterface;

  constructor(props: BatchTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'Batch' } as BaseTransactionFields);
    this.Transactions = p['Transactions'] as Array<{ readonly Transaction: Record<string, unknown> }>;
    assignDefined(this, p, ['Flags']);
  }

  override validate(): void {
    super.validate();
    if (!isArray(this.Transactions) || this.Transactions.length === 0)
      throw new ValidationError('Batch: missing or empty Transactions');
    if (!this.Transactions.every(item => isRecord(item) && isRecord(item['Transaction'])))
      throw new ValidationError('Batch: invalid Transactions array');
  }
}
