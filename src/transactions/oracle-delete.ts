/**
 * OracleDelete transaction — delete an oracle's data.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { OracleTransaction } from '../groups/oracle.js';
import { ValidationError } from '../errors.js';
import { isNumber } from '../validation/helpers.js';

export interface OracleDeleteTxFields extends BaseTransactionFields {
  readonly TransactionType: 'OracleDelete';
  readonly OracleDocumentID: number;
}

export class OracleDeleteTx extends OracleTransaction {
  override readonly TransactionType = 'OracleDelete' as const;
  readonly OracleDocumentID!: number;

  constructor(props: OracleDeleteTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'OracleDelete' } as BaseTransactionFields);
    this.OracleDocumentID = p['OracleDocumentID'] as number;
  }

  override validate(): void {
    super.validate();
    if (!isNumber(this.OracleDocumentID))
      throw new ValidationError('OracleDelete: missing OracleDocumentID');
  }
}
