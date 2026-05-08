/**
 * VaultDeposit transaction — deposit funds into a vault.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { VaultTransaction } from '../groups/vault.js';
import { ValidationError } from '../errors.js';
import { isAmount } from '../validation/helpers.js';

export interface VaultDepositTxFields extends BaseTransactionFields {
  readonly TransactionType: 'VaultDeposit';
  readonly VaultID: string;
  readonly Amount: Amount;
}

export class VaultDepositTx extends VaultTransaction {
  override readonly TransactionType = 'VaultDeposit' as const;
  readonly VaultID!: string;
  readonly Amount!: Amount;

  constructor(props: VaultDepositTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'VaultDeposit' } as BaseTransactionFields);
    this.VaultID = p['VaultID'] as string;
    this.Amount = p['Amount'] as Amount;
  }

  override validate(): void {
    super.validate();
    if (typeof this.VaultID !== 'string')
      throw new ValidationError('VaultDeposit: VaultID must be a string');
    if (!isAmount(this.Amount))
      throw new ValidationError('VaultDeposit: invalid Amount');
  }
}
