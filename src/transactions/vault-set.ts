/**
 * VaultSet transaction — update properties of a vault.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { VaultTransaction } from '../groups/vault.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isNumber } from '../validation/helpers.js';

export interface VaultSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'VaultSet';
  readonly VaultID: string;
  readonly SettleDelay?: number;
}

export class VaultSetTx extends VaultTransaction {
  override readonly TransactionType = 'VaultSet' as const;
  readonly VaultID!: string;
  readonly SettleDelay?: number;

  constructor(props: VaultSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'VaultSet' } as BaseTransactionFields);
    this.VaultID = p['VaultID'] as string;
    assignDefined(this, p, ['SettleDelay']);
  }

  override validate(): void {
    super.validate();
    if (typeof this.VaultID !== 'string')
      throw new ValidationError('VaultSet: VaultID must be a string');
    if (this.SettleDelay !== undefined && !isNumber(this.SettleDelay))
      throw new ValidationError('VaultSet: SettleDelay must be a number');
  }
}
