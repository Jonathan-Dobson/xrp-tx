/**
 * AMMCreate transaction — create a new Automated Market Maker.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { AMMTransaction } from '../groups/amm.js';
import { ValidationError } from '../errors.js';
import { isAmount, isNumber } from '../validation/helpers.js';

export interface AMMCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AMMCreate';
  readonly Amount: Amount;
  readonly Amount2: Amount;
  readonly TradingFee: number;
}

export class AMMCreateTx extends AMMTransaction {
  override readonly TransactionType = 'AMMCreate' as const;
  readonly Amount!: Amount;
  readonly Amount2!: Amount;
  readonly TradingFee!: number;

  constructor(props: AMMCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AMMCreate' } as BaseTransactionFields);
    this.Amount = p['Amount'] as Amount;
    this.Amount2 = p['Amount2'] as Amount;
    this.TradingFee = p['TradingFee'] as number;
  }

  override validate(): void {
    super.validate();
    if (!isAmount(this.Amount)) throw new ValidationError('AMMCreate: invalid Amount');
    if (!isAmount(this.Amount2)) throw new ValidationError('AMMCreate: invalid Amount2');
    if (!isNumber(this.TradingFee)) throw new ValidationError('AMMCreate: missing TradingFee');
    if (this.TradingFee < 0 || this.TradingFee > 1000)
      throw new ValidationError('AMMCreate: TradingFee must be between 0 and 1000');
  }
}
