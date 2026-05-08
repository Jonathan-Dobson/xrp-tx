/**
 * XChainCreateBridge transaction — create a new cross-chain bridge.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { XChainBridge } from '../types/common.js';
import { XChainTransaction } from '../groups/xchain.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isXChainBridge } from '../validation/helpers.js';

export interface XChainCreateBridgeTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainCreateBridge';
  readonly XChainBridge: XChainBridge;
  readonly SignatureReward: string;
  readonly MinAccountCreateAmount?: string;
}

export class XChainCreateBridgeTx extends XChainTransaction {
  override readonly TransactionType = 'XChainCreateBridge' as const;
  readonly XChainBridge!: XChainBridge;
  readonly SignatureReward!: string;
  readonly MinAccountCreateAmount?: string;

  constructor(props: XChainCreateBridgeTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainCreateBridge' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as XChainBridge;
    this.SignatureReward = p['SignatureReward'] as string;
    assignDefined(this, p, ['MinAccountCreateAmount']);
  }

  override validate(): void {
    super.validate();
    if (!isXChainBridge(this.XChainBridge))
      throw new ValidationError('XChainCreateBridge: invalid XChainBridge');
    if (typeof this.SignatureReward !== 'string')
      throw new ValidationError('XChainCreateBridge: SignatureReward must be a string');
  }
}
