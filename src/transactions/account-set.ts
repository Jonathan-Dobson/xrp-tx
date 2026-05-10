/**
 * AccountSet transaction — modify account-specific settings or flags.
 *
 * @see https://xrpl.org/accountset.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { AccountSetFlagsInterface } from '../types/flags.js';
import { AccountTransaction } from '../groups/account.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isNumber, isString } from '../validation/helpers.js';

export interface AccountSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AccountSet';
  /** Hash of a certificate to use for some external validation. */
  readonly ClearFlag?: number;
  /** Domain name associated with this account (hex encoded). */
  readonly Domain?: string;
  /** Email hash (e.g. for Gravatar). */
  readonly EmailHash?: string;
  /** Message key for encrypted messaging. */
  readonly MessageKey?: string;
  /** NFT collection fee (0-50,000). */
  readonly NFTokenBrokerFee?: number;
  /** Flag to enable on the account. */
  readonly SetFlag?: number;
  /** Transfer rate for issued currencies (drops per billion). */
  readonly TransferRate?: number;
  /** Tick size for offer matching (3-15 or 0 to disable). */
  readonly TickSize?: number;
  /** Bit-flags for this transaction. */
  readonly Flags?: number | AccountSetFlagsInterface;
}

export class AccountSetTx extends AccountTransaction {
  override readonly TransactionType = 'AccountSet' as const;

  readonly ClearFlag?: number = undefined;
  readonly Domain?: string = undefined;
  readonly EmailHash?: string = undefined;
  readonly MessageKey?: string = undefined;
  readonly NFTokenBrokerFee?: number = undefined;
  readonly SetFlag?: number = undefined;
  readonly TransferRate?: number = undefined;
  readonly TickSize?: number = undefined;
  declare readonly Flags?: number | AccountSetFlagsInterface;

  constructor(props: AccountSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AccountSet' } as BaseTransactionFields);
    assignDefined(this, p, [
      'ClearFlag', 'Domain', 'EmailHash', 'MessageKey',
      'NFTokenBrokerFee', 'SetFlag', 'TransferRate', 'TickSize', 'Flags',
    ]);
  }

  override validate(): void {
    super.validate();
    if (this.TransferRate !== undefined) {
      if (!isNumber(this.TransferRate)) throw new ValidationError('AccountSet: TransferRate must be a number');
    }
    if (this.TickSize !== undefined) {
      if (!isNumber(this.TickSize)) throw new ValidationError('AccountSet: TickSize must be a number');
      if (this.TickSize !== 0 && (this.TickSize < 3 || this.TickSize > 15)) {
        throw new ValidationError('AccountSet: TickSize must be 3-15 or 0');
      }
    }
    if (this.Domain !== undefined && !isString(this.Domain)) {
      throw new ValidationError('AccountSet: Domain must be a string');
    }
  }
}
