/**
 * AMMWithdraw transaction — remove liquidity from an AMM instance.
 *
 * @see https://xrpl.org/ammwithdraw.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { Amount } from '../types/amounts.js';
import { AMMTransaction } from '../groups/amm.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isRecord } from '../validation/helpers.js';

export interface AMMWithdrawTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AMMWithdraw';
  readonly Asset: Record<string, unknown>;
  readonly Asset2: Record<string, unknown>;
  readonly Amount?: Amount;
  readonly Amount2?: Amount;
  readonly EPrice?: Amount;
  readonly LPTokenIn?: Amount;
}

export class AMMWithdrawTx extends AMMTransaction {
  override readonly TransactionType = 'AMMWithdraw' as const;

  readonly Asset: Record<string, unknown> = undefined as any;
  readonly Asset2: Record<string, unknown> = undefined as any;
  readonly Amount?: Amount = undefined;
  readonly Amount2?: Amount = undefined;
  readonly EPrice?: Amount = undefined;
  readonly LPTokenIn?: Amount = undefined;

  constructor(props: AMMWithdrawTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AMMWithdraw' } as BaseTransactionFields);
    this.Asset = p['Asset'] as Record<string, unknown>;
    this.Asset2 = p['Asset2'] as Record<string, unknown>;
    assignDefined(this, p, ['Amount', 'Amount2', 'EPrice', 'LPTokenIn']);
  }

  override validate(): void {
    super.validate();
    if (!isRecord(this.Asset)) throw new ValidationError('AMMWithdraw: missing or invalid Asset');
    if (!isRecord(this.Asset2)) throw new ValidationError('AMMWithdraw: missing or invalid Asset2');
  }
}
