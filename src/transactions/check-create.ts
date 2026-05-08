/**
 * CheckCreate transaction — create a deferred payment (check).
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import { PaymentTransaction } from '../groups/payment.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isAccount, isNumber, isString } from '../validation/helpers.js';

export interface CheckCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'CheckCreate';
  readonly Destination: string;
  readonly SendMax: Amount;
  readonly DestinationTag?: number;
  readonly Expiration?: number;
  readonly InvoiceID?: string;
}

export class CheckCreateTx extends PaymentTransaction {
  override readonly TransactionType = 'CheckCreate' as const;
  readonly Destination!: string;
  readonly SendMax!: Amount;
  readonly DestinationTag?: number;
  readonly Expiration?: number;
  readonly InvoiceID?: string;

  constructor(props: CheckCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'CheckCreate' } as BaseTransactionFields);
    this.Destination = p['Destination'] as string;
    this.SendMax = p['SendMax'] as Amount;
    assignDefined(this, p, ['DestinationTag', 'Expiration', 'InvoiceID']);
  }

  override getAmount(): Amount { return this.SendMax; }
  override getDestination(): string { return this.Destination; }

  override validate(): void {
    super.validate();
    if (!isAccount(this.Destination)) throw new ValidationError('CheckCreate: invalid Destination');
    if (!isAmount(this.SendMax)) throw new ValidationError('CheckCreate: invalid SendMax');
    if (this.DestinationTag !== undefined && !isNumber(this.DestinationTag))
      throw new ValidationError('CheckCreate: DestinationTag must be a number');
    if (this.Expiration !== undefined && !isNumber(this.Expiration))
      throw new ValidationError('CheckCreate: Expiration must be a number');
    if (this.InvoiceID !== undefined && !isString(this.InvoiceID))
      throw new ValidationError('CheckCreate: InvoiceID must be a string');
  }
}
