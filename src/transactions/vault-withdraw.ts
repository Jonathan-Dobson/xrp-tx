/**
 * VaultWithdraw transaction — withdraw funds from a vault.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { VaultTransaction } from '../groups/vault.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount } from '../validation/helpers.js';

export interface VaultWithdrawTxFields extends BaseTransactionFields {
  readonly TransactionType: 'VaultWithdraw';
  readonly VaultID: string;
  readonly Amount: Amount;
  readonly Destination?: string;
  readonly DestinationTag?: number;
}

export class VaultWithdrawTx extends VaultTransaction {
  override readonly TransactionType = 'VaultWithdraw' as const;
  readonly VaultID!: string;
  readonly Amount!: Amount;
  readonly Destination?: string;
  readonly DestinationTag?: number;

  constructor(props: VaultWithdrawTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'VaultWithdraw' } as BaseTransactionFields);
    this.VaultID = p['VaultID'] as string;
    this.Amount = p['Amount'] as Amount;
    assignDefined(this, p, ['Destination', 'DestinationTag']);
  }

  override validate(): void {
    super.validate();
    if (typeof this.VaultID !== 'string')
      throw new ValidationError('VaultWithdraw: VaultID must be a string');
    if (!isAmount(this.Amount))
      throw new ValidationError('VaultWithdraw: invalid Amount');
  }
}
