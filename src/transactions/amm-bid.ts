/**
 * AMMBid transaction — bid on an auction for an AMM instance's trading fee.
 *
 * @see https://xrpl.org/ammbid.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { IssuedCurrencyAmount } from '../types/amounts.js';
import { AMMTransaction } from '../groups/amm.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isRecord, isAmount } from '../validation/helpers.js';

export interface AMMBidTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AMMBid';
  readonly Asset: Record<string, unknown>;
  readonly Asset2: Record<string, unknown>;
  /** Max amount of LP tokens to spend. */
  readonly BidMax?: IssuedCurrencyAmount;
  /** Fixed amount of LP tokens to spend. */
  readonly BidMin?: IssuedCurrencyAmount;
  /** Accounts allowed to use the fee discount. */
  readonly AuthAccounts?: Record<string, string>[];
}

export class AMMBidTx extends AMMTransaction {
  override readonly TransactionType = 'AMMBid' as const;

  readonly Asset: Record<string, unknown> = undefined as any;
  readonly Asset2: Record<string, unknown> = undefined as any;
  readonly BidMax?: IssuedCurrencyAmount = undefined;
  readonly BidMin?: IssuedCurrencyAmount = undefined;
  readonly AuthAccounts?: Record<string, string>[] = undefined;

  constructor(props: AMMBidTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AMMBid' } as BaseTransactionFields);
    this.Asset = p['Asset'] as Record<string, unknown>;
    assignDefined(this, p, ['Asset2', 'BidMax', 'BidMin', 'AuthAccounts']);
  }

  override validate(): void {
    super.validate();
    if (!isRecord(this.Asset)) throw new ValidationError('AMMBid: missing or invalid Asset');
    if (this.BidMax && !isAmount(this.BidMax)) throw new ValidationError('AMMBid: invalid BidMax');
    if (this.BidMin && !isAmount(this.BidMin)) throw new ValidationError('AMMBid: invalid BidMin');
  }
}
