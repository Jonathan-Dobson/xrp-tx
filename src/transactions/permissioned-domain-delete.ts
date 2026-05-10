/**
 * PermissionedDomainDelete transaction — delete a permissioned domain.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction } from '../transaction.js';

export interface PermissionedDomainDeleteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'PermissionedDomainDelete';
}

export class PermissionedDomainDeleteTx extends Transaction {
  override readonly TransactionType = 'PermissionedDomainDelete' as const;

  constructor(props: PermissionedDomainDeleteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'PermissionedDomainDelete' } as BaseTransactionFields);
  }

  override validate(): void {
    super.validate();
  }
}
