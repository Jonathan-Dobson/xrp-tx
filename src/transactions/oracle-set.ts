/**
 * OracleSet transaction — provide or update external data on the ledger.
 *
 * @see https://xrpl.org/oracleset.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isNumber, isArray } from '../validation/helpers.js';

export interface OracleSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'OracleSet';
  /** Unique ID for this oracle instance. */
  readonly OracleDocumentID: number;
  /** When the data was last updated. */
  readonly LastUpdateTime: number;
  /** The data series provided by the oracle. */
  readonly PriceDataSeries: Record<string, unknown>[];
  /** Source of the oracle data. */
  readonly Provider?: string;
  /** Description of the oracle. */
  readonly URI?: string;
  /** Identifier for the asset base. */
  readonly AssetBase?: string;
  /** Identifier for the asset quote. */
  readonly AssetQuote?: string;
}

export class OracleSetTx extends Transaction {
  override readonly TransactionType = 'OracleSet' as const;

  readonly OracleDocumentID: number = undefined as any;
  readonly LastUpdateTime: number = undefined as any;
  readonly PriceDataSeries: Record<string, unknown>[] = undefined as any;
  readonly Provider?: string = undefined;
  readonly URI?: string = undefined;
  readonly AssetBase?: string = undefined;
  readonly AssetQuote?: string = undefined;

  constructor(props: OracleSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'OracleSet' } as BaseTransactionFields);
    this.OracleDocumentID = p['OracleDocumentID'] as number;
    this.LastUpdateTime = p['LastUpdateTime'] as number;
    this.PriceDataSeries = p['PriceDataSeries'] as Record<string, unknown>[];
    assignDefined(this, p, ['Provider', 'URI', 'AssetBase', 'AssetQuote']);
  }

  override validate(): void {
    super.validate();
    if (!isNumber(this.OracleDocumentID)) throw new ValidationError('OracleSet: missing or invalid OracleDocumentID');
    if (!isNumber(this.LastUpdateTime)) throw new ValidationError('OracleSet: missing or invalid LastUpdateTime');
    if (!isArray(this.PriceDataSeries)) throw new ValidationError('OracleSet: missing or invalid PriceDataSeries');
  }
}
