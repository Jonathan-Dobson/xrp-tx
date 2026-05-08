/**
 * CredentialCreate transaction — create a new authorization credential.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { CredentialTransaction } from '../groups/credential.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount, isString } from '../validation/helpers.js';

export interface CredentialCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'CredentialCreate';
  readonly Subject: string;
  readonly CredentialType: string;
  readonly Expiration?: number;
  readonly URI?: string;
}

export class CredentialCreateTx extends CredentialTransaction {
  override readonly TransactionType = 'CredentialCreate' as const;
  readonly Subject!: string;
  readonly CredentialType!: string;
  readonly Expiration?: number;
  readonly URI?: string;

  constructor(props: CredentialCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'CredentialCreate' } as BaseTransactionFields);
    this.Subject = p['Subject'] as string;
    this.CredentialType = p['CredentialType'] as string;
    assignDefined(this, p, ['Expiration', 'URI']);
  }

  override validate(): void {
    super.validate();
    if (!isAccount(this.Subject))
      throw new ValidationError('CredentialCreate: invalid Subject');
    if (!isString(this.CredentialType))
      throw new ValidationError('CredentialCreate: missing CredentialType');
  }
}
