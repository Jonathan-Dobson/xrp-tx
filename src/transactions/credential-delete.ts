/**
 * CredentialDelete transaction — delete an authorization credential.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { CredentialTransaction } from '../groups/credential.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount, isString } from '../validation/helpers.js';

export interface CredentialDeleteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'CredentialDelete';
  readonly Subject?: string;
  readonly Issuer?: string;
  readonly CredentialType: string;
}

export class CredentialDeleteTx extends CredentialTransaction {
  override readonly TransactionType = 'CredentialDelete' as const;
  readonly Subject?: string;
  readonly Issuer?: string;
  readonly CredentialType!: string;

  constructor(props: CredentialDeleteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'CredentialDelete' } as BaseTransactionFields);
    this.CredentialType = p['CredentialType'] as string;
    assignDefined(this, p, ['Subject', 'Issuer']);
  }

  override validate(): void {
    super.validate();
    if (!isString(this.CredentialType))
      throw new ValidationError('CredentialDelete: missing CredentialType');
    if (this.Subject !== undefined && !isAccount(this.Subject))
      throw new ValidationError('CredentialDelete: invalid Subject');
    if (this.Issuer !== undefined && !isAccount(this.Issuer))
      throw new ValidationError('CredentialDelete: invalid Issuer');
  }
}
