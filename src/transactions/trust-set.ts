/**
 * TrustSet transaction — create or modify a trust line.
 */
import type { IssuedCurrencyAmount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import type { TrustSetFlagsInterface } from '../types/flags.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isNumber } from '../validation/helpers.js';

export interface TrustSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'TrustSet';
  readonly LimitAmount: IssuedCurrencyAmount;
  readonly QualityIn?: number;
  readonly QualityOut?: number;
  readonly Flags?: number | TrustSetFlagsInterface;
}

export class TrustSetTx extends TokenTransaction {
  override readonly TransactionType = 'TrustSet' as const;
  readonly LimitAmount!: IssuedCurrencyAmount;
  readonly QualityIn?: number;
  readonly QualityOut?: number;
  declare readonly Flags?: number | TrustSetFlagsInterface;

  constructor(props: TrustSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'TrustSet' } as BaseTransactionFields);
    this.LimitAmount = p['LimitAmount'] as IssuedCurrencyAmount;
    assignDefined(this, p, ['QualityIn', 'QualityOut', 'Flags']);
  }

  override affectsTokenBalance(): boolean { return true; }

  override validate(): void {
    super.validate();
    if (this.LimitAmount === undefined)
      throw new ValidationError('TrustSet: missing field LimitAmount');
    if (!isAmount(this.LimitAmount))
      throw new ValidationError('TrustSet: invalid LimitAmount');
    if (this.QualityIn !== undefined && !isNumber(this.QualityIn))
      throw new ValidationError('TrustSet: QualityIn must be a number');
    if (this.QualityOut !== undefined && !isNumber(this.QualityOut))
      throw new ValidationError('TrustSet: QualityOut must be a number');
  }
}
