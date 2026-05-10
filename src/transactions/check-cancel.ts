/**
 * CheckCancel transaction — cancel an existing check.
 *
 * @see https://xrpl.org/checkcancel.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString } from '../validation/helpers.js';

export interface CheckCancelTxFields extends BaseTransactionFields {
  readonly TransactionType: 'CheckCancel';
  /** The ID of the check to cancel. */
  readonly CheckID: string;
}

export class CheckCancelTx extends Transaction {
  override readonly TransactionType = 'CheckCancel' as const;

  /** The ID of the check to cancel. */
  readonly CheckID: string = undefined as any;

  constructor(props: CheckCancelTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'CheckCancel' } as BaseTransactionFields);
    this.CheckID = p['CheckID'] as string;
  }

  override validate(): void {
    super.validate();
    if (!isString(this.CheckID)) throw new ValidationError('CheckCancel: missing or invalid CheckID');
  }
}
