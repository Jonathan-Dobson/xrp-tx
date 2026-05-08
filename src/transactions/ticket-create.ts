/**
 * TicketCreate transaction — set aside sequence numbers for future use.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { AccountTransaction } from '../groups/account.js';
import { ValidationError } from '../errors.js';
import { isNumber } from '../validation/helpers.js';

export interface TicketCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'TicketCreate';
  readonly TicketCount: number;
}

export class TicketCreateTx extends AccountTransaction {
  override readonly TransactionType = 'TicketCreate' as const;
  readonly TicketCount: number;

  constructor(props: TicketCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'TicketCreate' } as BaseTransactionFields);
    this.TicketCount = p['TicketCount'] as number;
  }

  override validate(): void {
    super.validate();
    if (!isNumber(this.TicketCount) || this.TicketCount < 1 || this.TicketCount > 250)
      throw new ValidationError('TicketCreate: TicketCount must be 1-250');
  }
}
