/**
 * PaymentChannelClaim transaction — claim XRP from a payment channel.
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import type { PaymentChannelClaimFlagsInterface } from '../types/flags.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isString } from '../validation/helpers.js';

export interface PaymentChannelClaimTxFields extends BaseTransactionFields {
  readonly TransactionType: 'PaymentChannelClaim';
  readonly Channel: string;
  readonly Balance?: Amount;
  readonly Amount?: Amount;
  readonly Signature?: string;
  readonly PublicKey?: string;
  readonly Flags?: number | PaymentChannelClaimFlagsInterface;
}

export class PaymentChannelClaimTx extends Transaction {
  override readonly TransactionType = 'PaymentChannelClaim' as const;
  readonly Channel!: string;
  readonly Balance?: Amount;
  readonly Amount?: Amount;
  readonly Signature?: string;
  readonly PublicKey?: string;
  declare readonly Flags?: number | PaymentChannelClaimFlagsInterface;

  constructor(props: PaymentChannelClaimTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'PaymentChannelClaim' } as BaseTransactionFields);
    this.Channel = p['Channel'] as string;
    assignDefined(this, p, ['Balance', 'Amount', 'Signature', 'PublicKey', 'Flags']);
  }

  override validate(): void {
    super.validate();
    if (!isString(this.Channel)) throw new ValidationError('PaymentChannelClaim: missing Channel');
    if (this.Balance !== undefined && !isAmount(this.Balance))
      throw new ValidationError('PaymentChannelClaim: invalid Balance');
    if (this.Amount !== undefined && !isAmount(this.Amount))
      throw new ValidationError('PaymentChannelClaim: invalid Amount');
    if (this.Signature !== undefined && !isString(this.Signature))
      throw new ValidationError('PaymentChannelClaim: Signature must be a string');
    if (this.PublicKey !== undefined && !isString(this.PublicKey))
      throw new ValidationError('PaymentChannelClaim: PublicKey must be a string');
  }
}
