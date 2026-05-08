/**
 * AccountDelete transaction — delete an account from the XRP Ledger.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { AccountTransaction } from '../groups/account.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount, isNumber } from '../validation/helpers.js';

export interface AccountDeleteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AccountDelete';
  readonly Destination: string;
  readonly DestinationTag?: number;
  readonly CredentialIDs?: string[];
}

export class AccountDeleteTx extends AccountTransaction {
  override readonly TransactionType = 'AccountDelete' as const;
  readonly Destination!: string;
  readonly DestinationTag?: number;
  readonly CredentialIDs?: string[];

  constructor(props: AccountDeleteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AccountDelete' } as BaseTransactionFields);
    this.Destination = p['Destination'] as string;
    assignDefined(this, p, ['DestinationTag', 'CredentialIDs']);
  }

  override validate(): void {
    super.validate();
    if (!isAccount(this.Destination))
      throw new ValidationError('AccountDelete: invalid Destination');
    if (this.DestinationTag !== undefined && !isNumber(this.DestinationTag))
      throw new ValidationError('AccountDelete: DestinationTag must be a number');
  }
}
