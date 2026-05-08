/**
 * XChainClaim transaction — claim funds from a cross-chain bridge.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { XChainBridge } from '../types/common.js';
import type { Amount } from '../types/amounts.js';
import { XChainTransaction } from '../groups/xchain.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isXChainBridge, isAmount, isAccount } from '../validation/helpers.js';

export interface XChainClaimTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainClaim';
  readonly XChainBridge: XChainBridge;
  readonly XChainClaimID: string | number;
  readonly Amount: Amount;
  readonly Destination: string;
  readonly DestinationTag?: number;
}

export class XChainClaimTx extends XChainTransaction {
  override readonly TransactionType = 'XChainClaim' as const;
  readonly XChainBridge!: XChainBridge;
  readonly XChainClaimID!: string | number;
  readonly Amount!: Amount;
  readonly Destination!: string;
  readonly DestinationTag?: number;

  constructor(props: XChainClaimTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainClaim' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as XChainBridge;
    this.XChainClaimID = p['XChainClaimID'] as string | number;
    this.Amount = p['Amount'] as Amount;
    this.Destination = p['Destination'] as string;
    assignDefined(this, p, ['DestinationTag']);
  }

  override validate(): void {
    super.validate();
    if (!isXChainBridge(this.XChainBridge))
      throw new ValidationError('XChainClaim: invalid XChainBridge');
    if (!isAmount(this.Amount))
      throw new ValidationError('XChainClaim: invalid Amount');
    if (!isAccount(this.Destination))
      throw new ValidationError('XChainClaim: invalid Destination');
  }
}
