/**
 * AMMBid transaction — bid on an Automated Market Maker's auction slot.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { IssuedCurrencyAmount } from '../types/amounts.js';
import type { AuthAccount } from '../types/common.js';
import { AMMTransaction } from '../groups/amm.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isIssuedCurrencyAmount, isArray, isRecord, isString } from '../validation/helpers.js';

export interface AMMBidTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AMMBid';
  readonly Asset: { currency: string; issuer?: string };
  readonly Asset2: { currency: string; issuer?: string };
  readonly BidMin?: IssuedCurrencyAmount;
  readonly BidMax?: IssuedCurrencyAmount;
  readonly AuthAccounts?: AuthAccount[];
}

function isAuthAccount(value: unknown): value is AuthAccount {
  if (!isRecord(value)) return false;
  const auth = value['AuthAccount'];
  if (!isRecord(auth)) return false;
  return isString(auth['Account']);
}

export class AMMBidTx extends AMMTransaction {
  override readonly TransactionType = 'AMMBid' as const;
  readonly Asset!: { currency: string; issuer?: string };
  readonly Asset2!: { currency: string; issuer?: string };
  readonly BidMin?: IssuedCurrencyAmount;
  readonly BidMax?: IssuedCurrencyAmount;
  readonly AuthAccounts?: AuthAccount[];

  constructor(props: AMMBidTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AMMBid' } as BaseTransactionFields);
    this.Asset = p['Asset'] as { currency: string; issuer?: string };
    this.Asset2 = p['Asset2'] as { currency: string; issuer?: string };
    assignDefined(this, p, ['BidMin', 'BidMax', 'AuthAccounts']);
  }

  override validate(): void {
    super.validate();
    if (!this.Asset) throw new ValidationError('AMMBid: missing Asset');
    if (!this.Asset2) throw new ValidationError('AMMBid: missing Asset2');
    if (this.BidMin !== undefined && !isIssuedCurrencyAmount(this.BidMin))
      throw new ValidationError('AMMBid: invalid BidMin');
    if (this.BidMax !== undefined && !isIssuedCurrencyAmount(this.BidMax))
      throw new ValidationError('AMMBid: invalid BidMax');
    if (this.AuthAccounts !== undefined) {
      if (!isArray(this.AuthAccounts) || !this.AuthAccounts.every(isAuthAccount))
        throw new ValidationError('AMMBid: invalid AuthAccounts');
    }
  }
}
