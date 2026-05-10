/**
 * XChainClaim transaction — claim funds on the destination chain that were committed on the source chain.
 *
 * @see https://xrpl.org/xchainclaim.html
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import { XChainTransaction } from '../groups/xchain.js';
import { ValidationError } from '../errors.js';
import { isAmount, isRecord, isNumber } from '../validation/helpers.js';

export interface XChainClaimTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainClaim';
  /** Definition of the bridge to use. */
  readonly XChainBridge: Record<string, unknown>;
  /** The claim ID on the destination chain. */
  readonly XChainClaimID: number;
  /** The destination account for the funds. */
  readonly Destination: string;
  /** The amount to claim. */
  readonly Amount: Amount;
}

export class XChainClaimTx extends XChainTransaction {
  override readonly TransactionType = 'XChainClaim' as const;

  /** Definition of the bridge to use. */
  readonly XChainBridge: Record<string, unknown> = undefined as any;

  /** The claim ID on the destination chain. */
  readonly XChainClaimID: number = undefined as any;

  /** The destination account for the funds. */
  readonly Destination: string = undefined as any;

  /** The amount to claim. */
  readonly Amount: Amount = undefined as any;

  constructor(props: XChainClaimTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainClaim' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as Record<string, unknown>;
    this.XChainClaimID = p['XChainClaimID'] as number;
    this.Destination = p['Destination'] as string;
    this.Amount = p['Amount'] as Amount;
  }

  override validate(): void {
    super.validate();
    if (!isRecord(this.XChainBridge)) throw new ValidationError('XChainClaim: missing or invalid XChainBridge');
    if (!isNumber(this.XChainClaimID)) throw new ValidationError('XChainClaim: missing or invalid XChainClaimID');
    if (!isAmount(this.Amount)) throw new ValidationError('XChainClaim: missing or invalid Amount');
  }
}
