/**
 * CheckCancel transaction — cancel an unredeemed check.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString } from '../validation/helpers.js';

export interface CheckCancelTxFields extends BaseTransactionFields {
  readonly TransactionType: 'CheckCancel';
  readonly CheckID: string;
}

export class CheckCancelTx extends Transaction {
  override readonly TransactionType = 'CheckCancel' as const;
  readonly CheckID: string;

  constructor(props: CheckCancelTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'CheckCancel' } as BaseTransactionFields);
    this.CheckID = p['CheckID'] as string;
  }

  override validate(): void {
    super.validate();
    if (!isString(this.CheckID)) throw new ValidationError('CheckCancel: missing CheckID');
  }
}
