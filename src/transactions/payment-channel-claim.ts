/**
 * PaymentChannelClaim transaction — claim XRP from a payment channel.
 *
 * @see https://xrpl.org/paymentchannelclaim.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString } from '../validation/helpers.js';

export interface PaymentChannelClaimTxFields extends BaseTransactionFields {
  readonly TransactionType: 'PaymentChannelClaim';
  /** The unique ID of the channel. */
  readonly Channel: string;
  /** Total amount to claim from the channel. */
  readonly Amount?: Amount;
  /** Cumulative amount authorized by the signature. */
  readonly Balance?: Amount;
  /** Public key used for the signature. */
  readonly PublicKey?: string;
  /** Signature for the authorized amount. */
  readonly Signature?: string;
}

export class PaymentChannelClaimTx extends Transaction {
  override readonly TransactionType = 'PaymentChannelClaim' as const;

  /** The unique ID of the channel. */
  readonly Channel: string = undefined as any;

  readonly Amount?: Amount = undefined;
  readonly Balance?: Amount = undefined;
  readonly PublicKey?: string = undefined;
  readonly Signature?: string = undefined;

  constructor(props: PaymentChannelClaimTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'PaymentChannelClaim' } as BaseTransactionFields);
    this.Channel = p['Channel'] as string;
    assignDefined(this, p, ['Amount', 'Balance', 'PublicKey', 'Signature']);
  }

  override validate(): void {
    super.validate();
    if (!isString(this.Channel)) throw new ValidationError('PaymentChannelClaim: missing or invalid Channel');
  }
}
