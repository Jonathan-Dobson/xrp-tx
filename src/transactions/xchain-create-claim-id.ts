/**
 * XChainCreateClaimID transaction — create a claim ID for cross-chain transfers.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { XChainBridge } from '../types/common.js';
import { XChainTransaction } from '../groups/xchain.js';
import { ValidationError } from '../errors.js';
import { isXChainBridge, isAccount } from '../validation/helpers.js';

export interface XChainCreateClaimIDTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainCreateClaimID';
  readonly XChainBridge: XChainBridge;
  readonly SignatureReward: string;
  readonly OtherChainSource: string;
}

export class XChainCreateClaimIDTx extends XChainTransaction {
  override readonly TransactionType = 'XChainCreateClaimID' as const;
  readonly XChainBridge!: XChainBridge;
  readonly SignatureReward!: string;
  readonly OtherChainSource!: string;

  constructor(props: XChainCreateClaimIDTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainCreateClaimID' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as XChainBridge;
    this.SignatureReward = p['SignatureReward'] as string;
    this.OtherChainSource = p['OtherChainSource'] as string;
  }

  override validate(): void {
    super.validate();
    if (!isXChainBridge(this.XChainBridge))
      throw new ValidationError('XChainCreateClaimID: invalid XChainBridge');
    if (typeof this.SignatureReward !== 'string')
      throw new ValidationError('XChainCreateClaimID: SignatureReward must be a string');
    if (!isAccount(this.OtherChainSource))
      throw new ValidationError('XChainCreateClaimID: invalid OtherChainSource');
  }
}
