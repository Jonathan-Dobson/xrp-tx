/**
 * XChainAddClaimAttestation transaction — add an attestation to a cross-chain claim.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { XChainBridge } from '../types/common.js';
import type { Amount } from '../types/amounts.js';
import { XChainTransaction } from '../groups/xchain.js';
import { ValidationError } from '../errors.js';
import { isXChainBridge, isAmount, isAccount, isString } from '../validation/helpers.js';

export interface XChainAddClaimAttestationTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainAddClaimAttestation';
  readonly XChainBridge: XChainBridge;
  readonly XChainClaimID: string | number;
  readonly Destination: string;
  readonly Amount: Amount;
  readonly AttestationPubKey: string;
  readonly AttestationSignature: string;
  readonly AttestationRewardAccount: string;
  readonly WasLockingChainSend: 0 | 1;
}

export class XChainAddClaimAttestationTx extends XChainTransaction {
  override readonly TransactionType = 'XChainAddClaimAttestation' as const;
  readonly XChainBridge!: XChainBridge;
  readonly XChainClaimID!: string | number;
  readonly Destination!: string;
  readonly Amount!: Amount;
  readonly AttestationPubKey!: string;
  readonly AttestationSignature!: string;
  readonly AttestationRewardAccount!: string;
  readonly WasLockingChainSend!: 0 | 1;

  constructor(props: XChainAddClaimAttestationTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainAddClaimAttestation' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as XChainBridge;
    this.XChainClaimID = p['XChainClaimID'] as string | number;
    this.Destination = p['Destination'] as string;
    this.Amount = p['Amount'] as Amount;
    this.AttestationPubKey = p['AttestationPubKey'] as string;
    this.AttestationSignature = p['AttestationSignature'] as string;
    this.AttestationRewardAccount = p['AttestationRewardAccount'] as string;
    this.WasLockingChainSend = p['WasLockingChainSend'] as 0 | 1;
  }

  override validate(): void {
    super.validate();
    if (!isXChainBridge(this.XChainBridge))
      throw new ValidationError('XChainAddClaimAttestation: invalid XChainBridge');
    if (!isAccount(this.Destination))
      throw new ValidationError('XChainAddClaimAttestation: invalid Destination');
    if (!isAmount(this.Amount))
      throw new ValidationError('XChainAddClaimAttestation: invalid Amount');
    if (!isString(this.AttestationPubKey))
      throw new ValidationError('XChainAddClaimAttestation: missing AttestationPubKey');
    if (!isString(this.AttestationSignature))
      throw new ValidationError('XChainAddClaimAttestation: missing AttestationSignature');
    if (!isAccount(this.AttestationRewardAccount))
      throw new ValidationError('XChainAddClaimAttestation: invalid AttestationRewardAccount');
  }
}
