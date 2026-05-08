/**
 * DIDSet transaction — create or update a DID document.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString } from '../validation/helpers.js';

export interface DIDSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'DIDSet';
  readonly Data?: string;
  readonly DIDDocument?: string;
  readonly URI?: string;
}

export class DIDSetTx extends Transaction {
  override readonly TransactionType = 'DIDSet' as const;
  readonly Data?: string;
  readonly DIDDocument?: string;
  readonly URI?: string;

  constructor(props: DIDSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'DIDSet' } as BaseTransactionFields);
    assignDefined(this, p, ['Data', 'DIDDocument', 'URI']);
  }

  override validate(): void {
    super.validate();
    if (this.Data !== undefined && !isString(this.Data))
      throw new ValidationError('DIDSet: Data must be a string');
    if (this.DIDDocument !== undefined && !isString(this.DIDDocument))
      throw new ValidationError('DIDSet: DIDDocument must be a string');
    if (this.URI !== undefined && !isString(this.URI))
      throw new ValidationError('DIDSet: URI must be a string');
  }
}
