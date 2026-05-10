/**
 * PaymentChannelCreate transaction — create a unidirectional payment channel.
 *
 * @see https://xrpl.org/paymentchannelcreate.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount, isAmount, isNumber } from '../validation/helpers.js';

export interface PaymentChannelCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'PaymentChannelCreate';
  /** The amount of XRP (in drops) to deposit in the channel. */
  readonly Amount: string;
  /** The address that can receive funds from the channel. */
  readonly Destination: string;
  /** Number of seconds the sender must wait to settle after requesting closure. */
  readonly SettleDelay: number;
  /** The public key the destination must use to sign claims. */
  readonly PublicKey: string;
  /** Time after which the channel expires. */
  readonly CancelAfter?: number;
  /** Arbitrary destination tag for the recipient. */
  readonly DestinationTag?: number;
}

export class PaymentChannelCreateTx extends Transaction {
  override readonly TransactionType = 'PaymentChannelCreate' as const;

  /** The amount of XRP (in drops) to deposit. */
  readonly Amount: string = undefined as any;

  /** The address that can receive funds. */
  readonly Destination: string = undefined as any;

  /** Number of seconds to wait before settlement. */
  readonly SettleDelay: number = undefined as any;

  /** The public key for signing claims. */
  readonly PublicKey: string = undefined as any;

  readonly CancelAfter?: number = undefined;
  readonly DestinationTag?: number = undefined;

  constructor(props: PaymentChannelCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'PaymentChannelCreate' } as BaseTransactionFields);
    this.Amount = p['Amount'] as string;
    this.Destination = p['Destination'] as string;
    this.SettleDelay = p['SettleDelay'] as number;
    this.PublicKey = p['PublicKey'] as string;
    assignDefined(this, p, ['CancelAfter', 'DestinationTag']);
  }

  override validate(): void {
    super.validate();
    if (!isAmount(this.Amount)) throw new ValidationError('PaymentChannelCreate: missing or invalid Amount');
    if (!isAccount(this.Destination)) throw new ValidationError('PaymentChannelCreate: missing or invalid Destination');
    if (!isNumber(this.SettleDelay)) throw new ValidationError('PaymentChannelCreate: missing or invalid SettleDelay');
  }
}
