/**
 * XChainAccountCreateCommit transaction — commit funds to create a new account on a destination chain.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { XChainTransaction } from '../groups/xchain.js';
import { ValidationError } from '../errors.js';
import { isAmount, isRecord } from '../validation/helpers.js';

export interface XChainAccountCreateCommitTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainAccountCreateCommit';
  /** Definition of the bridge to use. */
  readonly XChainBridge: Record<string, unknown>;
  /** The address of the account to create on the destination chain. */
  readonly Destination: string;
  /** The amount to commit for account creation. */
  readonly Amount: string;
  /** The signature reward for the account creation. */
  readonly SignatureReward: string;
}

export class XChainAccountCreateCommitTx extends XChainTransaction {
  override readonly TransactionType = 'XChainAccountCreateCommit' as const;

  /** Definition of the bridge to use. */
  readonly XChainBridge: Record<string, unknown> = undefined as any;

  /** The address of the account to create on the destination chain. */
  readonly Destination: string = undefined as any;

  /** The amount to commit for account creation. */
  readonly Amount: string = undefined as any;

  /** The signature reward for the account creation. */
  readonly SignatureReward: string = undefined as any;

  constructor(props: XChainAccountCreateCommitTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainAccountCreateCommit' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as Record<string, unknown>;
    this.Destination = p['Destination'] as string;
    this.Amount = p['Amount'] as string;
    this.SignatureReward = p['SignatureReward'] as string;
  }

  override validate(): void {
    super.validate();
    if (!isRecord(this.XChainBridge)) throw new ValidationError('XChainAccountCreateCommit: missing or invalid XChainBridge');
    if (!isAmount(this.Amount)) throw new ValidationError('XChainAccountCreateCommit: missing or invalid Amount');
  }
}
