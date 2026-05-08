/**
 * AMMDelete transaction — delete an Automated Market Maker.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { AMMTransaction } from '../groups/amm.js';
import { ValidationError } from '../errors.js';

export interface AMMDeleteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'AMMDelete';
  readonly Asset: { currency: string; issuer?: string };
  readonly Asset2: { currency: string; issuer?: string };
}

export class AMMDeleteTx extends AMMTransaction {
  override readonly TransactionType = 'AMMDelete' as const;
  readonly Asset!: { currency: string; issuer?: string };
  readonly Asset2!: { currency: string; issuer?: string };

  constructor(props: AMMDeleteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'AMMDelete' } as BaseTransactionFields);
    this.Asset = p['Asset'] as { currency: string; issuer?: string };
    this.Asset2 = p['Asset2'] as { currency: string; issuer?: string };
  }

  override validate(): void {
    super.validate();
    if (!this.Asset) throw new ValidationError('AMMDelete: missing Asset');
    if (!this.Asset2) throw new ValidationError('AMMDelete: missing Asset2');
  }
}
