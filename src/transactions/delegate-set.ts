/**
 * DelegateSet transaction — assign delegate permissions.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { AccountTransaction } from '../groups/account.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount } from '../validation/helpers.js';

export interface DelegateSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'DelegateSet';
  readonly Authorize?: string;
  readonly Unauthorize?: string;
}

export class DelegateSetTx extends AccountTransaction {
  override readonly TransactionType = 'DelegateSet' as const;
  readonly Authorize?: string;
  readonly Unauthorize?: string;

  constructor(props: DelegateSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'DelegateSet' } as BaseTransactionFields);
    assignDefined(this, p, ['Authorize', 'Unauthorize']);
  }

  override validate(): void {
    super.validate();
    if (this.Authorize !== undefined && !isAccount(this.Authorize))
      throw new ValidationError('DelegateSet: invalid Authorize');
    if (this.Unauthorize !== undefined && !isAccount(this.Unauthorize))
      throw new ValidationError('DelegateSet: invalid Unauthorize');
  }
}
