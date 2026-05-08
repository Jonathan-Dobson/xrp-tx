/**
 * DepositPreauth transaction — preauthorize an account for deposits.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { AccountTransaction } from '../groups/account.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount } from '../validation/helpers.js';

export interface DepositPreauthTxFields extends BaseTransactionFields {
  readonly TransactionType: 'DepositPreauth';
  readonly Authorize?: string;
  readonly Unauthorize?: string;
}

export class DepositPreauthTx extends AccountTransaction {
  override readonly TransactionType = 'DepositPreauth' as const;
  readonly Authorize?: string;
  readonly Unauthorize?: string;

  constructor(props: DepositPreauthTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'DepositPreauth' } as BaseTransactionFields);
    assignDefined(this, p, ['Authorize', 'Unauthorize']);
  }

  override validate(): void {
    super.validate();
    if (this.Authorize === undefined && this.Unauthorize === undefined)
      throw new ValidationError('DepositPreauth: must have Authorize or Unauthorize');
    if (this.Authorize !== undefined && this.Unauthorize !== undefined)
      throw new ValidationError('DepositPreauth: cannot have both Authorize and Unauthorize');
    if (this.Authorize !== undefined && !isAccount(this.Authorize))
      throw new ValidationError('DepositPreauth: invalid Authorize');
    if (this.Unauthorize !== undefined && !isAccount(this.Unauthorize))
      throw new ValidationError('DepositPreauth: invalid Unauthorize');
  }
}
