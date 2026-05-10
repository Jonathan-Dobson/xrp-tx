/**
 * LoanDelete transaction — delete a loan definition from the ledger.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString } from '../validation/helpers.js';

export interface LoanDeleteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'LoanDelete';
  /** The asset associated with the loan. */
  readonly Asset: string;
}

export class LoanDeleteTx extends Transaction {
  override readonly TransactionType = 'LoanDelete' as const;

  readonly Asset: string = undefined as any;

  constructor(props: LoanDeleteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'LoanDelete' } as BaseTransactionFields);
    this.Asset = p['Asset'] as string;
  }

  override validate(): void {
    super.validate();
    if (!isString(this.Asset)) throw new ValidationError('LoanDelete: missing or invalid Asset');
  }
}
