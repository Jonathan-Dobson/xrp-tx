/**
 * EscrowCreate transaction — create a held payment.
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import { PaymentTransaction } from '../groups/payment.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAmount, isAccount, isNumber, isString } from '../validation/helpers.js';

export interface EscrowCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'EscrowCreate';
  readonly Amount: Amount;
  readonly Destination: string;
  readonly DestinationTag?: number;
  readonly CancelAfter?: number;
  readonly FinishAfter?: number;
  readonly Condition?: string;
}

export class EscrowCreateTx extends PaymentTransaction {
  override readonly TransactionType = 'EscrowCreate' as const;
  readonly Amount!: Amount;
  readonly Destination!: string;
  readonly DestinationTag?: number;
  readonly CancelAfter?: number;
  readonly FinishAfter?: number;
  readonly Condition?: string;

  constructor(props: EscrowCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'EscrowCreate' } as BaseTransactionFields);
    this.Amount = p['Amount'] as Amount;
    this.Destination = p['Destination'] as string;
    assignDefined(this, p, ['DestinationTag', 'CancelAfter', 'FinishAfter', 'Condition']);
  }

  override getAmount(): Amount { return this.Amount; }
  override getDestination(): string { return this.Destination; }

  override validate(): void {
    super.validate();
    if (!isAmount(this.Amount)) throw new ValidationError('EscrowCreate: invalid Amount');
    if (!isAccount(this.Destination)) throw new ValidationError('EscrowCreate: invalid Destination');
    if (this.DestinationTag !== undefined && !isNumber(this.DestinationTag))
      throw new ValidationError('EscrowCreate: DestinationTag must be a number');
    if (this.CancelAfter !== undefined && !isNumber(this.CancelAfter))
      throw new ValidationError('EscrowCreate: CancelAfter must be a number');
    if (this.FinishAfter !== undefined && !isNumber(this.FinishAfter))
      throw new ValidationError('EscrowCreate: FinishAfter must be a number');
    if (this.Condition !== undefined && !isString(this.Condition))
      throw new ValidationError('EscrowCreate: Condition must be a string');
    if (this.CancelAfter === undefined && this.FinishAfter === undefined)
      throw new ValidationError('EscrowCreate: must have CancelAfter or FinishAfter');
  }
}
