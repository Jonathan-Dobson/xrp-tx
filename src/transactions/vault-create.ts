/**
 * VaultCreate transaction — create a new vault.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { VaultTransaction } from '../groups/vault.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount, isNumber } from '../validation/helpers.js';

export interface VaultCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'VaultCreate';
  readonly Owner?: string;
  readonly SettleDelay: number;
}

export class VaultCreateTx extends VaultTransaction {
  override readonly TransactionType = 'VaultCreate' as const;
  readonly Owner?: string;
  readonly SettleDelay!: number;

  constructor(props: VaultCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'VaultCreate' } as BaseTransactionFields);
    this.SettleDelay = p['SettleDelay'] as number;
    assignDefined(this, p, ['Owner']);
  }

  override validate(): void {
    super.validate();
    if (!isNumber(this.SettleDelay))
      throw new ValidationError('VaultCreate: missing SettleDelay');
    if (this.Owner !== undefined && !isAccount(this.Owner))
      throw new ValidationError('VaultCreate: invalid Owner');
  }
}
