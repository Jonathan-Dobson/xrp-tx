/**
 * AMMVote transaction — vote on the trading fee for an Automated Market Maker.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { AMMTransaction } from '../groups/amm.js';
import { ValidationError } from '../errors.js';
import { isNumber } from '../validation/helpers.js';

export interface AMMVoteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AMMVote';
  readonly Asset: { currency: string; issuer?: string };
  readonly Asset2: { currency: string; issuer?: string };
  readonly TradingFee: number;
}

export class AMMVoteTx extends AMMTransaction {
  override readonly TransactionType = 'AMMVote' as const;
  readonly Asset!: { currency: string; issuer?: string };
  readonly Asset2!: { currency: string; issuer?: string };
  readonly TradingFee!: number;

  constructor(props: AMMVoteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AMMVote' } as BaseTransactionFields);
    this.Asset = p['Asset'] as { currency: string; issuer?: string };
    this.Asset2 = p['Asset2'] as { currency: string; issuer?: string };
    this.TradingFee = p['TradingFee'] as number;
  }

  override validate(): void {
    super.validate();
    if (!this.Asset) throw new ValidationError('AMMVote: missing Asset');
    if (!this.Asset2) throw new ValidationError('AMMVote: missing Asset2');
    if (!isNumber(this.TradingFee)) throw new ValidationError('AMMVote: missing TradingFee');
    if (this.TradingFee < 0 || this.TradingFee > 1000)
      throw new ValidationError('AMMVote: TradingFee must be between 0 and 1000');
  }
}
