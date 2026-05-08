/**
 * VaultClawback transaction — claw back funds from a vault.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { VaultTransaction } from '../groups/vault.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isAccount } from '../validation/helpers.js';

export interface VaultClawbackTxFields extends BaseTransactionFields {
  readonly TransactionType: 'VaultClawback';
  readonly VaultID: string;
  readonly Holder: string;
  readonly Amount?: Amount;
}

export class VaultClawbackTx extends VaultTransaction {
  override readonly TransactionType = 'VaultClawback' as const;
  readonly VaultID!: string;
  readonly Holder!: string;
  readonly Amount?: Amount;

  constructor(props: VaultClawbackTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'VaultClawback' } as BaseTransactionFields);
    this.VaultID = p['VaultID'] as string;
    this.Holder = p['Holder'] as string;
    assignDefined(this, p, ['Amount']);
  }

  override validate(): void {
    super.validate();
    if (typeof this.VaultID !== 'string')
      throw new ValidationError('VaultClawback: VaultID must be a string');
    if (!isAccount(this.Holder))
      throw new ValidationError('VaultClawback: invalid Holder');
    if (this.Amount !== undefined && !isAmount(this.Amount))
      throw new ValidationError('VaultClawback: invalid Amount');
  }
}
