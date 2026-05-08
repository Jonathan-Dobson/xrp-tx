/**
 * Payment transaction — transfer value from one account to another.
 */
import type { Amount } from '../types/amounts.js';
import type { Path } from '../types/common.js';
import type { BaseTransactionFields } from '../types/base.js';
import type { PaymentFlagsInterface } from '../types/flags.js';
import { PaymentFlags } from '../types/flags.js';
import { PaymentTransaction } from '../groups/payment.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import {
  isAmount,
  isAccount,
  isNumber,
  isString,
  isPaths,
  isDomainID,
  isFlagEnabled,
} from '../validation/helpers.js';

export interface PaymentTxFields extends BaseTransactionFields {
  readonly TransactionType: 'Payment';
  readonly Amount: Amount;
  readonly DeliverMax?: Amount;
  readonly Destination: string;
  readonly DestinationTag?: number;
  readonly InvoiceID?: string;
  readonly Paths?: Path[];
  readonly SendMax?: Amount;
  readonly DeliverMin?: Amount;
  readonly CredentialIDs?: string[];
  readonly DomainID?: string;
  readonly Flags?: number | PaymentFlagsInterface;
}

const PAYMENT_OPTIONAL = [
  'DeliverMax', 'DestinationTag', 'InvoiceID', 'Paths',
  'SendMax', 'DeliverMin', 'CredentialIDs', 'DomainID', 'Flags',
] as const;

export class PaymentTx extends PaymentTransaction {
  override readonly TransactionType = 'Payment' as const;
  readonly Amount!: Amount;
  readonly Destination!: string;
  readonly DeliverMax?: Amount;
  readonly DestinationTag?: number;
  readonly InvoiceID?: string;
  readonly Paths?: Path[];
  readonly SendMax?: Amount;
  readonly DeliverMin?: Amount;
  readonly CredentialIDs?: string[];
  readonly DomainID?: string;
  declare readonly Flags?: number | PaymentFlagsInterface;

  constructor(props: PaymentTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'Payment' } as BaseTransactionFields);
    this.Amount = p['Amount'] as Amount;
    this.Destination = p['Destination'] as string;
    assignDefined(this, p, PAYMENT_OPTIONAL as unknown as string[]);
  }

  override getAmount(): Amount { return this.Amount; }
  override getDestination(): string { return this.Destination; }

  override validate(): void {
    super.validate();
    if (!isAmount(this.Amount))
      throw new ValidationError('Payment: invalid Amount');
    if (!isAccount(this.Destination))
      throw new ValidationError('Payment: invalid Destination');
    if (this.DestinationTag !== undefined && !isNumber(this.DestinationTag))
      throw new ValidationError('Payment: DestinationTag must be a number');
    if (this.InvoiceID !== undefined && !isString(this.InvoiceID))
      throw new ValidationError('Payment: InvoiceID must be a string');
    if (this.Paths !== undefined && !isPaths(this.Paths))
      throw new ValidationError('Payment: invalid Paths');
    if (this.SendMax !== undefined && !isAmount(this.SendMax))
      throw new ValidationError('Payment: invalid SendMax');
    if (this.DomainID !== undefined && !isDomainID(this.DomainID))
      throw new ValidationError('Payment: invalid DomainID');
    this.validatePartialPayment();
  }

  private validatePartialPayment(): void {
    if (this.DeliverMin == null) return;
    if (this.Flags == null) {
      throw new ValidationError('Payment: tfPartialPayment flag required with DeliverMin');
    }
    const flags = this.Flags;
    const isPartial = typeof flags === 'number'
      ? isFlagEnabled(flags, PaymentFlags.tfPartialPayment)
      : (flags.tfPartialPayment ?? false);
    if (!isPartial) {
      throw new ValidationError('Payment: tfPartialPayment flag required with DeliverMin');
    }
    if (!isAmount(this.DeliverMin))
      throw new ValidationError('Payment: invalid DeliverMin');
  }
}
