/**
 * VaultDelete transaction — delete a vault.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { VaultTransaction } from '../groups/vault.js';
import { ValidationError } from '../errors.js';

export interface VaultDeleteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'VaultDelete';
  readonly VaultID: string;
}

export class VaultDeleteTx extends VaultTransaction {
  override readonly TransactionType = 'VaultDelete' as const;
  readonly VaultID!: string;

  constructor(props: VaultDeleteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'VaultDelete' } as BaseTransactionFields);
    this.VaultID = p['VaultID'] as string;
  }

  override validate(): void {
    super.validate();
    if (typeof this.VaultID !== 'string')
      throw new ValidationError('VaultDelete: VaultID must be a string');
  }
}
