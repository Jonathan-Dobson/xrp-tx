/**
 * CheckCash transaction — redeem a check.
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isString } from '../validation/helpers.js';

export interface CheckCashTxFields extends BaseTransactionFields {
  readonly TransactionType: 'CheckCash';
  readonly CheckID: string;
  readonly Amount?: Amount;
  readonly DeliverMin?: Amount;
}

export class CheckCashTx extends Transaction {
  override readonly TransactionType = 'CheckCash' as const;
  readonly CheckID!: string;
  readonly Amount?: Amount;
  readonly DeliverMin?: Amount;

  constructor(props: CheckCashTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'CheckCash' } as BaseTransactionFields);
    this.CheckID = p['CheckID'] as string;
    assignDefined(this, p, ['Amount', 'DeliverMin']);
  }

  override validate(): void {
    super.validate();
    if (!isString(this.CheckID)) throw new ValidationError('CheckCash: missing CheckID');
    if (this.Amount === undefined && this.DeliverMin === undefined)
      throw new ValidationError('CheckCash: must have Amount or DeliverMin');
    if (this.Amount !== undefined && this.DeliverMin !== undefined)
      throw new ValidationError('CheckCash: cannot have both Amount and DeliverMin');
    if (this.Amount !== undefined && !isAmount(this.Amount))
      throw new ValidationError('CheckCash: invalid Amount');
    if (this.DeliverMin !== undefined && !isAmount(this.DeliverMin))
      throw new ValidationError('CheckCash: invalid DeliverMin');
  }
}
