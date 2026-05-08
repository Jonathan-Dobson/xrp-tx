/**
 * AMMDeposit transaction — add liquidity to an Automated Market Maker.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount, IssuedCurrencyAmount } from '../types/amounts.js';
import type { AMMDepositFlagsInterface } from '../types/flags.js';
import { AMMTransaction } from '../groups/amm.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isIssuedCurrencyAmount } from '../validation/helpers.js';

export interface AMMDepositTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AMMDeposit';
  readonly Asset: { currency: string; issuer?: string };
  readonly Asset2: { currency: string; issuer?: string };
  readonly Amount?: Amount;
  readonly Amount2?: Amount;
  readonly EPrice?: Amount;
  readonly LPTokenOut?: IssuedCurrencyAmount;
  readonly Flags?: number | AMMDepositFlagsInterface;
}

export class AMMDepositTx extends AMMTransaction {
  override readonly TransactionType = 'AMMDeposit' as const;
  readonly Asset!: { currency: string; issuer?: string };
  readonly Asset2!: { currency: string; issuer?: string };
  readonly Amount?: Amount;
  readonly Amount2?: Amount;
  readonly EPrice?: Amount;
  readonly LPTokenOut?: IssuedCurrencyAmount;
  declare readonly Flags?: number | AMMDepositFlagsInterface;

  constructor(props: AMMDepositTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AMMDeposit' } as BaseTransactionFields);
    this.Asset = p['Asset'] as { currency: string; issuer?: string };
    this.Asset2 = p['Asset2'] as { currency: string; issuer?: string };
    assignDefined(this, p, ['Amount', 'Amount2', 'EPrice', 'LPTokenOut', 'Flags']);
  }

  override validate(): void {
    super.validate();
    if (!this.Asset) throw new ValidationError('AMMDeposit: missing Asset');
    if (!this.Asset2) throw new ValidationError('AMMDeposit: missing Asset2');
    if (this.Amount !== undefined && !isAmount(this.Amount))
      throw new ValidationError('AMMDeposit: invalid Amount');
    if (this.Amount2 !== undefined && !isAmount(this.Amount2))
      throw new ValidationError('AMMDeposit: invalid Amount2');
    if (this.EPrice !== undefined && !isAmount(this.EPrice))
      throw new ValidationError('AMMDeposit: invalid EPrice');
    if (this.LPTokenOut !== undefined && !isIssuedCurrencyAmount(this.LPTokenOut))
      throw new ValidationError('AMMDeposit: invalid LPTokenOut');
  }
}
