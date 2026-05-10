/**
 * DIDSet transaction — create or update a Decentralized Identifier (DID) entry on the ledger.
 *
 * @see https://xrpl.org/didset.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';

export interface DIDSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'DIDSet';
  /** The DID document (hex encoded). */
  readonly Data?: string;
  /** The DID URI. */
  readonly DIDDocument?: string;
  /** The public key associated with the DID. */
  readonly URI?: string;
}

export class DIDSetTx extends Transaction {
  override readonly TransactionType = 'DIDSet' as const;

  readonly Data?: string = undefined;
  readonly DIDDocument?: string = undefined;
  readonly URI?: string = undefined;

  constructor(props: DIDSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'DIDSet' } as BaseTransactionFields);
    assignDefined(this, p, ['Data', 'DIDDocument', 'URI']);
  }

  override validate(): void {
    super.validate();
    if (this.Data === undefined && this.DIDDocument === undefined && this.URI === undefined) {
      throw new ValidationError('DIDSet: must specify at least one of Data, DIDDocument, or URI');
    }
  }
}
