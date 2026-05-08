/**
 * XChainAccountCreateCommit transaction — commit funds to create an account on another chain.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { XChainBridge } from '../types/common.js';
import { XChainTransaction } from '../groups/xchain.js';
import { ValidationError } from '../errors.js';
import { isXChainBridge, isAccount } from '../validation/helpers.js';

export interface XChainAccountCreateCommitTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainAccountCreateCommit';
  readonly XChainBridge: XChainBridge;
  readonly SignatureReward: string;
  readonly Destination: string;
  readonly Amount: string;
}

export class XChainAccountCreateCommitTx extends XChainTransaction {
  override readonly TransactionType = 'XChainAccountCreateCommit' as const;
  readonly XChainBridge!: XChainBridge;
  readonly SignatureReward!: string;
  readonly Destination!: string;
  readonly Amount!: string;

  constructor(props: XChainAccountCreateCommitTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainAccountCreateCommit' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as XChainBridge;
    this.SignatureReward = p['SignatureReward'] as string;
    this.Destination = p['Destination'] as string;
    this.Amount = p['Amount'] as string;
  }

  override validate(): void {
    super.validate();
    if (!isXChainBridge(this.XChainBridge))
      throw new ValidationError('XChainAccountCreateCommit: invalid XChainBridge');
    if (typeof this.SignatureReward !== 'string')
      throw new ValidationError('XChainAccountCreateCommit: SignatureReward must be a string');
    if (!isAccount(this.Destination))
      throw new ValidationError('XChainAccountCreateCommit: invalid Destination');
    if (typeof this.Amount !== 'string')
      throw new ValidationError('XChainAccountCreateCommit: Amount must be a string');
  }
}
