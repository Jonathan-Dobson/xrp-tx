/**
 * SetRegularKey transaction — assign or remove a regular key pair.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { AccountTransaction } from '../groups/account.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount } from '../validation/helpers.js';

export interface SetRegularKeyTxFields extends BaseTransactionFields {
  readonly TransactionType: 'SetRegularKey';
  readonly RegularKey?: string;
}

export class SetRegularKeyTx extends AccountTransaction {
  override readonly TransactionType = 'SetRegularKey' as const;
  readonly RegularKey?: string;

  constructor(props: SetRegularKeyTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'SetRegularKey' } as BaseTransactionFields);
    assignDefined(this, p, ['RegularKey']);
  }

  override validate(): void {
    super.validate();
    if (this.RegularKey !== undefined && !isAccount(this.RegularKey))
      throw new ValidationError('SetRegularKey: invalid RegularKey');
  }
}
