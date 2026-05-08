/**
 * Clawback transaction — claw back issued tokens.
 */
import type { ClawbackAmount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import type { ClawbackFlagsInterface } from '../types/flags.js';
import { AccountTransaction } from '../groups/account.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isClawbackAmount } from '../validation/helpers.js';

export interface ClawbackTxFields extends BaseTransactionFields {
  readonly TransactionType: 'Clawback';
  readonly Amount: ClawbackAmount;
  readonly Flags?: number | ClawbackFlagsInterface;
}

export class ClawbackTx extends AccountTransaction {
  override readonly TransactionType = 'Clawback' as const;
  readonly Amount!: ClawbackAmount;
  declare readonly Flags?: number | ClawbackFlagsInterface;

  constructor(props: ClawbackTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'Clawback' } as BaseTransactionFields);
    this.Amount = p['Amount'] as ClawbackAmount;
    assignDefined(this, p, ['Flags']);
  }

  override validate(): void {
    super.validate();
    if (!isClawbackAmount(this.Amount))
      throw new ValidationError('Clawback: invalid Amount (must be IssuedCurrency or MPT)');
  }
}
