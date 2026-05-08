/**
 * PaymentChannelFund transaction — add XRP to a payment channel.
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isString, isNumber } from '../validation/helpers.js';

export interface PaymentChannelFundTxFields extends BaseTransactionFields {
  readonly TransactionType: 'PaymentChannelFund';
  readonly Channel: string;
  readonly Amount: Amount;
  readonly Expiration?: number;
}

export class PaymentChannelFundTx extends Transaction {
  override readonly TransactionType = 'PaymentChannelFund' as const;
  readonly Channel!: string;
  readonly Amount!: Amount;
  readonly Expiration?: number;

  constructor(props: PaymentChannelFundTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'PaymentChannelFund' } as BaseTransactionFields);
    this.Channel = p['Channel'] as string;
    this.Amount = p['Amount'] as Amount;
    assignDefined(this, p, ['Expiration']);
  }

  override validate(): void {
    super.validate();
    if (!isString(this.Channel)) throw new ValidationError('PaymentChannelFund: missing Channel');
    if (!isAmount(this.Amount)) throw new ValidationError('PaymentChannelFund: invalid Amount');
    if (this.Expiration !== undefined && !isNumber(this.Expiration))
      throw new ValidationError('PaymentChannelFund: Expiration must be a number');
  }
}
