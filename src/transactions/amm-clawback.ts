/**
 * AMMClawback transaction — claw back liquidity from an Automated Market Maker.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import type { ClawbackFlagsInterface } from '../types/flags.js';
import { AMMTransaction } from '../groups/amm.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isAccount } from '../validation/helpers.js';

export interface AMMClawbackTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AMMClawback';
  readonly Asset: { currency: string; issuer?: string };
  readonly Asset2: { currency: string; issuer?: string };
  readonly Holder: string;
  readonly Amount?: Amount;
  readonly Flags?: number | ClawbackFlagsInterface;
}

export class AMMClawbackTx extends AMMTransaction {
  override readonly TransactionType = 'AMMClawback' as const;
  readonly Asset!: { currency: string; issuer?: string };
  readonly Asset2!: { currency: string; issuer?: string };
  readonly Holder!: string;
  readonly Amount?: Amount;
  declare readonly Flags?: number | ClawbackFlagsInterface;

  constructor(props: AMMClawbackTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AMMClawback' } as BaseTransactionFields);
    this.Asset = p['Asset'] as { currency: string; issuer?: string };
    this.Asset2 = p['Asset2'] as { currency: string; issuer?: string };
    this.Holder = p['Holder'] as string;
    assignDefined(this, p, ['Amount', 'Flags']);
  }

  override validate(): void {
    super.validate();
    if (!this.Asset) throw new ValidationError('AMMClawback: missing Asset');
    if (!this.Asset2) throw new ValidationError('AMMClawback: missing Asset2');
    if (!isAccount(this.Holder)) throw new ValidationError('AMMClawback: invalid Holder');
    if (this.Amount !== undefined && !isAmount(this.Amount))
      throw new ValidationError('AMMClawback: invalid Amount');
  }
}
