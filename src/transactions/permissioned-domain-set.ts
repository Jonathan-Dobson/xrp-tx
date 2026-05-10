/**
 * PermissionedDomainSet transaction — define or update a permissioned domain.
 *
 * @see https://xrpl.org/permissioneddomainset.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isArray } from '../validation/helpers.js';

export interface PermissionedDomainSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'PermissionedDomainSet';
  /** Accounts permitted within this domain. */
  readonly AcceptedAccounts?: string[];
  /** Credentials required for this domain. */
  readonly AcceptedCredentials?: any[];
}

export class PermissionedDomainSetTx extends Transaction {
  override readonly TransactionType = 'PermissionedDomainSet' as const;

  readonly AcceptedAccounts?: string[] = undefined;
  readonly AcceptedCredentials?: any[] = undefined;

  constructor(props: PermissionedDomainSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'PermissionedDomainSet' } as BaseTransactionFields);
    assignDefined(this, p, ['AcceptedAccounts', 'AcceptedCredentials']);
  }

  override validate(): void {
    super.validate();
    if (this.AcceptedAccounts !== undefined && !isArray(this.AcceptedAccounts)) {
      throw new ValidationError('PermissionedDomainSet: AcceptedAccounts must be an array');
    }
  }
}
