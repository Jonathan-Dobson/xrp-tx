/**
 * SetRegularKey transaction — assign, change, or remove a secondary signing key for an account.
 *
 * @see https://xrpl.org/setregularkey.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import { AccountTransaction } from '../groups/account.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount } from '../validation/helpers.js';

export interface SetRegularKeyTxFields extends BaseTransactionFields {
  readonly TransactionType: 'SetRegularKey';
  /** The address of the new regular key (leave empty to remove). */
  readonly RegularKey?: string;
}

export class SetRegularKeyTx extends AccountTransaction {
  override readonly TransactionType = 'SetRegularKey' as const;

  /** The address of the new regular key. */
  readonly RegularKey?: string = undefined;

  constructor(props: SetRegularKeyTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'SetRegularKey' } as BaseTransactionFields);
    assignDefined(this, p, ['RegularKey']);
  }

  override validate(): void {
    super.validate();
    if (this.RegularKey !== undefined && !isAccount(this.RegularKey)) {
      throw new ValidationError('SetRegularKey: invalid RegularKey');
    }
  }
}
