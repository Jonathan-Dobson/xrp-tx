/**
 * PaymentChannelCreate transaction — create a payment channel.
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import { PaymentTransaction } from '../groups/payment.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isAccount, isNumber, isString } from '../validation/helpers.js';

export interface PaymentChannelCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'PaymentChannelCreate';
  readonly Amount: Amount;
  readonly Destination: string;
  readonly SettleDelay: number;
  readonly PublicKey: string;
  readonly CancelAfter?: number;
  readonly DestinationTag?: number;
}

export class PaymentChannelCreateTx extends PaymentTransaction {
  override readonly TransactionType = 'PaymentChannelCreate' as const;
  readonly Amount!: Amount;
  readonly Destination!: string;
  readonly SettleDelay!: number;
  readonly PublicKey!: string;
  readonly CancelAfter?: number;
  readonly DestinationTag?: number;

  constructor(props: PaymentChannelCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'PaymentChannelCreate' } as BaseTransactionFields);
    this.Amount = p['Amount'] as Amount;
    this.Destination = p['Destination'] as string;
    this.SettleDelay = p['SettleDelay'] as number;
    this.PublicKey = p['PublicKey'] as string;
    assignDefined(this, p, ['CancelAfter', 'DestinationTag']);
  }

  override getAmount(): Amount { return this.Amount; }
  override getDestination(): string { return this.Destination; }

  override validate(): void {
    super.validate();
    if (!isAmount(this.Amount)) throw new ValidationError('PaymentChannelCreate: invalid Amount');
    if (!isAccount(this.Destination)) throw new ValidationError('PaymentChannelCreate: invalid Destination');
    if (!isNumber(this.SettleDelay)) throw new ValidationError('PaymentChannelCreate: missing SettleDelay');
    if (!isString(this.PublicKey)) throw new ValidationError('PaymentChannelCreate: missing PublicKey');
    if (this.CancelAfter !== undefined && !isNumber(this.CancelAfter))
      throw new ValidationError('PaymentChannelCreate: CancelAfter must be a number');
    if (this.DestinationTag !== undefined && !isNumber(this.DestinationTag))
      throw new ValidationError('PaymentChannelCreate: DestinationTag must be a number');
  }
}
