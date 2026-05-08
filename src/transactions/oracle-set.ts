/**
 * OracleSet transaction — create or update an oracle's data.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { OracleDataSeries } from '../types/common.js';
import { OracleTransaction } from '../groups/oracle.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isArray, isNumber, isString, isRecord } from '../validation/helpers.js';

export interface OracleSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'OracleSet';
  readonly OracleDocumentID: number;
  readonly LastUpdateTime: number;
  readonly PriceDataSeries: OracleDataSeries[];
  readonly Provider?: string;
  readonly URI?: string;
  readonly AssetClass?: string;
}

function isOracleDataSeries(value: unknown): value is OracleDataSeries {
  if (!isRecord(value)) return false;
  const priceData = value['PriceData'];
  if (!isRecord(priceData)) return false;
  return isString(priceData['BaseAsset']) && isString(priceData['QuoteAsset']);
}

export class OracleSetTx extends OracleTransaction {
  override readonly TransactionType = 'OracleSet' as const;
  readonly OracleDocumentID!: number;
  readonly LastUpdateTime!: number;
  readonly PriceDataSeries!: OracleDataSeries[];
  readonly Provider?: string;
  readonly URI?: string;
  readonly AssetClass?: string;

  constructor(props: OracleSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'OracleSet' } as BaseTransactionFields);
    this.OracleDocumentID = p['OracleDocumentID'] as number;
    this.LastUpdateTime = p['LastUpdateTime'] as number;
    this.PriceDataSeries = p['PriceDataSeries'] as OracleDataSeries[];
    assignDefined(this, p, ['Provider', 'URI', 'AssetClass']);
  }

  override validate(): void {
    super.validate();
    if (!isNumber(this.OracleDocumentID))
      throw new ValidationError('OracleSet: missing OracleDocumentID');
    if (!isNumber(this.LastUpdateTime))
      throw new ValidationError('OracleSet: missing LastUpdateTime');
    if (!isArray(this.PriceDataSeries) || !this.PriceDataSeries.every(isOracleDataSeries))
      throw new ValidationError('OracleSet: invalid PriceDataSeries');
  }
}
