/**
 * AccountSet transaction — modify properties of an account.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { AccountSetFlagsInterface } from '../types/flags.js';
import { AccountSetAsfFlags } from '../types/flags.js';
import { AccountTransaction } from '../groups/account.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount, isString, isNumber } from '../validation/helpers.js';

const MIN_TICK_SIZE = 3;
const MAX_TICK_SIZE = 15;

export interface AccountSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AccountSet';
  readonly ClearFlag?: number;
  readonly Domain?: string;
  readonly EmailHash?: string;
  readonly MessageKey?: string;
  readonly SetFlag?: AccountSetAsfFlags;
  readonly TransferRate?: number;
  readonly TickSize?: number;
  readonly NFTokenMinter?: string;
  readonly Flags?: number | AccountSetFlagsInterface;
}

const ACCTSET_OPTIONAL = [
  'ClearFlag', 'Domain', 'EmailHash', 'MessageKey',
  'SetFlag', 'TransferRate', 'TickSize', 'NFTokenMinter', 'Flags',
] as const;

export class AccountSetTx extends AccountTransaction {
  override readonly TransactionType = 'AccountSet' as const;
  readonly ClearFlag?: number;
  readonly Domain?: string;
  readonly EmailHash?: string;
  readonly MessageKey?: string;
  readonly SetFlag?: AccountSetAsfFlags;
  readonly TransferRate?: number;
  readonly TickSize?: number;
  readonly NFTokenMinter?: string;
  declare readonly Flags?: number | AccountSetFlagsInterface;

  constructor(props: AccountSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AccountSet' } as BaseTransactionFields);
    assignDefined(this, p, ACCTSET_OPTIONAL as unknown as string[]);
  }

  override validate(): void {
    super.validate();
    if (this.NFTokenMinter !== undefined && !isAccount(this.NFTokenMinter))
      throw new ValidationError('AccountSet: invalid NFTokenMinter');
    if (this.ClearFlag !== undefined) {
      if (!isNumber(this.ClearFlag)) throw new ValidationError('AccountSet: invalid ClearFlag');
      if (!Object.values(AccountSetAsfFlags).includes(this.ClearFlag))
        throw new ValidationError('AccountSet: invalid ClearFlag');
    }
    if (this.Domain !== undefined && !isString(this.Domain))
      throw new ValidationError('AccountSet: invalid Domain');
    if (this.EmailHash !== undefined && !isString(this.EmailHash))
      throw new ValidationError('AccountSet: invalid EmailHash');
    if (this.MessageKey !== undefined && !isString(this.MessageKey))
      throw new ValidationError('AccountSet: invalid MessageKey');
    if (this.SetFlag !== undefined) {
      if (!isNumber(this.SetFlag)) throw new ValidationError('AccountSet: invalid SetFlag');
      if (!Object.values(AccountSetAsfFlags).includes(this.SetFlag))
        throw new ValidationError('AccountSet: invalid SetFlag');
    }
    if (this.TransferRate !== undefined && !isNumber(this.TransferRate))
      throw new ValidationError('AccountSet: invalid TransferRate');
    if (this.TickSize !== undefined) {
      if (!isNumber(this.TickSize)) throw new ValidationError('AccountSet: invalid TickSize');
      if (this.TickSize !== 0 && (this.TickSize < MIN_TICK_SIZE || this.TickSize > MAX_TICK_SIZE))
        throw new ValidationError('AccountSet: invalid TickSize');
    }
  }
}
