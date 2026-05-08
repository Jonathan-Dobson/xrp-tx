/**
 * CredentialAccept transaction — accept an authorization credential.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { CredentialTransaction } from '../groups/credential.js';
import { ValidationError } from '../errors.js';
import { isAccount, isString } from '../validation/helpers.js';

export interface CredentialAcceptTxFields extends BaseTransactionFields {
  readonly TransactionType: 'CredentialAccept';
  readonly Issuer: string;
  readonly CredentialType: string;
}

export class CredentialAcceptTx extends CredentialTransaction {
  override readonly TransactionType = 'CredentialAccept' as const;
  readonly Issuer!: string;
  readonly CredentialType!: string;

  constructor(props: CredentialAcceptTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'CredentialAccept' } as BaseTransactionFields);
    this.Issuer = p['Issuer'] as string;
    this.CredentialType = p['CredentialType'] as string;
  }

  override validate(): void {
    super.validate();
    if (!isAccount(this.Issuer))
      throw new ValidationError('CredentialAccept: invalid Issuer');
    if (!isString(this.CredentialType))
      throw new ValidationError('CredentialAccept: missing CredentialType');
  }
}
