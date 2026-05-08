/**
 * PermissionedDomainSet transaction — create or update a permissioned domain.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { PermissionedDomainTransaction } from '../groups/permissioned-domain.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isArray } from '../validation/helpers.js';

export interface PermissionedDomainSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'PermissionedDomainSet';
  readonly AcceptedCredentials?: Array<{
    readonly Credential: { readonly Issuer: string; readonly CredentialType: string };
  }>;
}

export class PermissionedDomainSetTx extends PermissionedDomainTransaction {
  override readonly TransactionType = 'PermissionedDomainSet' as const;
  readonly AcceptedCredentials?: Array<{
    readonly Credential: { readonly Issuer: string; readonly CredentialType: string };
  }>;

  constructor(props: PermissionedDomainSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'PermissionedDomainSet' } as BaseTransactionFields);
    assignDefined(this, p, ['AcceptedCredentials']);
  }

  override validate(): void {
    super.validate();
    if (this.AcceptedCredentials !== undefined && !isArray(this.AcceptedCredentials))
      throw new ValidationError('PermissionedDomainSet: AcceptedCredentials must be an array');
  }
}
