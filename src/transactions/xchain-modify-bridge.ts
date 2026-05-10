/**
 * XChainModifyBridge transaction — update the parameters of an existing cross-chain bridge.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { XChainTransaction } from '../groups/xchain.js';
import { ValidationError } from '../errors.js';
import { isRecord } from '../validation/helpers.js';

export interface XChainModifyBridgeTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainModifyBridge';
  /** Definition of the bridge to modify. */
  readonly XChainBridge: Record<string, unknown>;
  /** New minimum account creation amount. */
  readonly MinAccountCreateAmount?: string;
  /** New signature reward. */
  readonly SignatureReward?: string;
}

export class XChainModifyBridgeTx extends XChainTransaction {
  override readonly TransactionType = 'XChainModifyBridge' as const;

  /** Definition of the bridge to modify. */
  readonly XChainBridge: Record<string, unknown> = undefined as any;

  readonly MinAccountCreateAmount?: string = undefined;
  readonly SignatureReward?: string = undefined;

  constructor(props: XChainModifyBridgeTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainModifyBridge' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as Record<string, unknown>;
    this.MinAccountCreateAmount = p['MinAccountCreateAmount'] as string;
    this.SignatureReward = p['SignatureReward'] as string;
  }

  override validate(): void {
    super.validate();
    if (!isRecord(this.XChainBridge)) throw new ValidationError('XChainModifyBridge: missing or invalid XChainBridge');
  }
}
