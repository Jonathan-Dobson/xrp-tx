/**
 * TrustSet transaction — create, modify, or delete a trust line for Issued Currencies.
 *
 * @see https://xrpl.org/trustset.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { IssuedCurrencyAmount } from '../types/amounts.js';
import type { TrustSetFlagsInterface } from '../types/flags.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount } from '../validation/helpers.js';

export interface TrustSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'TrustSet';
  /** The limit and currency for the trust line. */
  readonly LimitAmount: IssuedCurrencyAmount;
  /** Quality of incoming liquidity (default 0 = 100%). */
  readonly QualityIn?: number;
  /** Quality of outgoing liquidity (default 0 = 100%). */
  readonly QualityOut?: number;
  /** Bit-flags for this transaction. */
  readonly Flags?: number | TrustSetFlagsInterface;
}

export class TrustSetTx extends TokenTransaction {
  override readonly TransactionType = 'TrustSet' as const;

  /** The limit and currency for the trust line. */
  readonly LimitAmount: IssuedCurrencyAmount = undefined as any;

  readonly QualityIn?: number = undefined;
  readonly QualityOut?: number = undefined;
  declare readonly Flags?: number | TrustSetFlagsInterface;

  constructor(props: TrustSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'TrustSet' } as BaseTransactionFields);
    this.LimitAmount = p['LimitAmount'] as IssuedCurrencyAmount;
    assignDefined(this, p, ['QualityIn', 'QualityOut', 'Flags']);
  }

  override affectsTokenBalance(): boolean { return false; }

  override validate(): void {
    super.validate();
    if (!isAmount(this.LimitAmount)) {
      throw new ValidationError('TrustSet: missing or invalid LimitAmount');
    }
  }
}
