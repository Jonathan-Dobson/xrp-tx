/**
 * XChainModifyBridge transaction — modify properties of a cross-chain bridge.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { XChainBridge } from '../types/common.js';
import type { XChainModifyBridgeFlagsInterface } from '../types/flags.js';
import { XChainTransaction } from '../groups/xchain.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isXChainBridge } from '../validation/helpers.js';

export interface XChainModifyBridgeTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainModifyBridge';
  readonly XChainBridge: XChainBridge;
  readonly SignatureReward?: string;
  readonly MinAccountCreateAmount?: string;
  readonly Flags?: number | XChainModifyBridgeFlagsInterface;
}

export class XChainModifyBridgeTx extends XChainTransaction {
  override readonly TransactionType = 'XChainModifyBridge' as const;
  readonly XChainBridge!: XChainBridge;
  readonly SignatureReward?: string;
  readonly MinAccountCreateAmount?: string;
  declare readonly Flags?: number | XChainModifyBridgeFlagsInterface;

  constructor(props: XChainModifyBridgeTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainModifyBridge' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as XChainBridge;
    assignDefined(this, p, ['SignatureReward', 'MinAccountCreateAmount', 'Flags']);
  }

  override validate(): void {
    super.validate();
    if (!isXChainBridge(this.XChainBridge))
      throw new ValidationError('XChainModifyBridge: invalid XChainBridge');
  }
}
