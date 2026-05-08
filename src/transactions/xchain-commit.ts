/**
 * XChainCommit transaction — commit funds to a cross-chain bridge.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { XChainBridge } from '../types/common.js';
import type { Amount } from '../types/amounts.js';
import { XChainTransaction } from '../groups/xchain.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isXChainBridge, isAmount, isAccount } from '../validation/helpers.js';

export interface XChainCommitTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainCommit';
  readonly XChainBridge: XChainBridge;
  readonly XChainClaimID: string | number;
  readonly Amount: Amount;
  readonly OtherChainDestination?: string;
}

export class XChainCommitTx extends XChainTransaction {
  override readonly TransactionType = 'XChainCommit' as const;
  readonly XChainBridge!: XChainBridge;
  readonly XChainClaimID!: string | number;
  readonly Amount!: Amount;
  readonly OtherChainDestination?: string;

  constructor(props: XChainCommitTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainCommit' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as XChainBridge;
    this.XChainClaimID = p['XChainClaimID'] as string | number;
    this.Amount = p['Amount'] as Amount;
    assignDefined(this, p, ['OtherChainDestination']);
  }

  override validate(): void {
    super.validate();
    if (!isXChainBridge(this.XChainBridge))
      throw new ValidationError('XChainCommit: invalid XChainBridge');
    if (!isAmount(this.Amount))
      throw new ValidationError('XChainCommit: invalid Amount');
    if (this.OtherChainDestination !== undefined && !isAccount(this.OtherChainDestination))
      throw new ValidationError('XChainCommit: invalid OtherChainDestination');
  }
}
