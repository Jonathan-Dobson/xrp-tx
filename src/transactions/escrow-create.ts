/**
 * EscrowCreate transaction — lock up XRP until a condition is met or time expires.
 *
 * @see https://xrpl.org/escrowcreate.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import { PaymentTransaction } from '../groups/payment.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount, isAmount, isString } from '../validation/helpers.js';
import type { Amount } from '../types/amounts.js';

export interface EscrowCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'EscrowCreate';
  /** Amount of XRP to lock in the escrow. */
  readonly Amount: string;
  /** Address to receive the XRP when finished. */
  readonly Destination: string;
  /** Time after which the escrow is no longer valid. */
  readonly CancelAfter?: number;
  /** Time after which the escrow can be finished. */
  readonly FinishAfter?: number;
  /** Cryptographic condition that must be met to finish. */
  readonly Condition?: string;
  /** Destination tag for the recipient. */
  readonly DestinationTag?: number;
}

export class EscrowCreateTx extends PaymentTransaction {
  override readonly TransactionType = 'EscrowCreate' as const;

  /** Amount of XRP to lock. */
  readonly Amount: string = undefined as any;

  /** Destination address. */
  readonly Destination: string = undefined as any;

  readonly CancelAfter?: number = undefined;
  readonly FinishAfter?: number = undefined;
  readonly Condition?: string = undefined;
  readonly DestinationTag?: number = undefined;

  constructor(props: EscrowCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'EscrowCreate' } as BaseTransactionFields);
    this.Amount = p['Amount'] as string;
    this.Destination = p['Destination'] as string;
    assignDefined(this, p, ['CancelAfter', 'FinishAfter', 'Condition', 'DestinationTag']);
  }

  override getAmount(): Amount { return this.Amount; }
  override getDestination(): string { return this.Destination; }

  override validate(): void {
    super.validate();
    if (!isAmount(this.Amount)) throw new ValidationError('EscrowCreate: missing or invalid Amount');
    if (!isAccount(this.Destination)) throw new ValidationError('EscrowCreate: missing or invalid Destination');
    if (this.CancelAfter === undefined && this.FinishAfter === undefined) {
      throw new ValidationError('EscrowCreate: must specify CancelAfter or FinishAfter');
    }
    if (this.Condition !== undefined && !isString(this.Condition)) {
      throw new ValidationError('EscrowCreate: Condition must be a string');
    }
  }
}
