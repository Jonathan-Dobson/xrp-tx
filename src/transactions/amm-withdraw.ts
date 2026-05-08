/**
 * AMMWithdraw transaction — remove liquidity from an Automated Market Maker.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount, IssuedCurrencyAmount } from '../types/amounts.js';
import type { AMMWithdrawFlagsInterface } from '../types/flags.js';
import { AMMTransaction } from '../groups/amm.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isIssuedCurrencyAmount } from '../validation/helpers.js';

export interface AMMWithdrawTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AMMWithdraw';
  readonly Asset: { currency: string; issuer?: string };
  readonly Asset2: { currency: string; issuer?: string };
  readonly Amount?: Amount;
  readonly Amount2?: Amount;
  readonly EPrice?: Amount;
  readonly LPTokenIn?: IssuedCurrencyAmount;
  readonly Flags?: number | AMMWithdrawFlagsInterface;
}

export class AMMWithdrawTx extends AMMTransaction {
  override readonly TransactionType = 'AMMWithdraw' as const;
  readonly Asset!: { currency: string; issuer?: string };
  readonly Asset2!: { currency: string; issuer?: string };
  readonly Amount?: Amount;
  readonly Amount2?: Amount;
  readonly EPrice?: Amount;
  readonly LPTokenIn?: IssuedCurrencyAmount;
  declare readonly Flags?: number | AMMWithdrawFlagsInterface;

  constructor(props: AMMWithdrawTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AMMWithdraw' } as BaseTransactionFields);
    this.Asset = p['Asset'] as { currency: string; issuer?: string };
    this.Asset2 = p['Asset2'] as { currency: string; issuer?: string };
    assignDefined(this, p, ['Amount', 'Amount2', 'EPrice', 'LPTokenIn', 'Flags']);
  }

  override validate(): void {
    super.validate();
    if (!this.Asset) throw new ValidationError('AMMWithdraw: missing Asset');
    if (!this.Asset2) throw new ValidationError('AMMWithdraw: missing Asset2');
    if (this.Amount !== undefined && !isAmount(this.Amount))
      throw new ValidationError('AMMWithdraw: invalid Amount');
    if (this.Amount2 !== undefined && !isAmount(this.Amount2))
      throw new ValidationError('AMMWithdraw: invalid Amount2');
    if (this.EPrice !== undefined && !isAmount(this.EPrice))
      throw new ValidationError('AMMWithdraw: invalid EPrice');
    if (this.LPTokenIn !== undefined && !isIssuedCurrencyAmount(this.LPTokenIn))
      throw new ValidationError('AMMWithdraw: invalid LPTokenIn');
  }
}
