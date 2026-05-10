/**
 * CheckCash transaction — cash an existing check.
 *
 * @see https://xrpl.org/checkcash.html
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString } from '../validation/helpers.js';

export interface CheckCashTxFields extends BaseTransactionFields {
  readonly TransactionType: 'CheckCash';
  /** The ID of the check to cash. */
  readonly CheckID: string;
  /** Fixed amount to cash for. */
  readonly Amount?: Amount;
  /** Minimum amount to cash for (slippage control). */
  readonly DeliverMin?: Amount;
}

export class CheckCashTx extends Transaction {
  override readonly TransactionType = 'CheckCash' as const;

  /** The ID of the check to cash. */
  readonly CheckID: string = undefined as any;

  readonly Amount?: Amount = undefined;
  readonly DeliverMin?: Amount = undefined;

  constructor(props: CheckCashTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'CheckCash' } as BaseTransactionFields);
    this.CheckID = p['CheckID'] as string;
    assignDefined(this, p, ['Amount', 'DeliverMin']);
  }

  override validate(): void {
    super.validate();
    if (!isString(this.CheckID)) throw new ValidationError('CheckCash: missing or invalid CheckID');
    if (this.Amount !== undefined && this.DeliverMin !== undefined) {
      throw new ValidationError('CheckCash: cannot have both Amount and DeliverMin');
    }
    if (this.Amount === undefined && this.DeliverMin === undefined) {
      throw new ValidationError('CheckCash: must have either Amount or DeliverMin');
    }
  }
}
