/**
 * XChainAddAccountCreateAttestation transaction — add an attestation to a cross-chain account creation.
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { XChainBridge } from '../types/common.js';
import type { Amount } from '../types/amounts.js';
import { XChainTransaction } from '../groups/xchain.js';
import { ValidationError } from '../errors.js';
import { isXChainBridge, isAmount, isAccount, isString } from '../validation/helpers.js';

export interface XChainAddAccountCreateAttestationTxFields extends BaseTransactionFields {
  readonly TransactionType: 'XChainAddAccountCreateAttestation';
  readonly XChainBridge: XChainBridge;
  readonly XChainAccountCreateCount: string | number;
  readonly Destination: string;
  readonly Amount: Amount;
  readonly AttestationPubKey: string;
  readonly AttestationSignature: string;
  readonly AttestationRewardAccount: string;
  readonly WasLockingChainSend: 0 | 1;
}

export class XChainAddAccountCreateAttestationTx extends XChainTransaction {
  override readonly TransactionType = 'XChainAddAccountCreateAttestation' as const;
  readonly XChainBridge!: XChainBridge;
  readonly XChainAccountCreateCount!: string | number;
  readonly Destination!: string;
  readonly Amount!: Amount;
  readonly AttestationPubKey!: string;
  readonly AttestationSignature!: string;
  readonly AttestationRewardAccount!: string;
  readonly WasLockingChainSend!: 0 | 1;

  constructor(props: XChainAddAccountCreateAttestationTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'XChainAddAccountCreateAttestation' } as BaseTransactionFields);
    this.XChainBridge = p['XChainBridge'] as XChainBridge;
    this.XChainAccountCreateCount = p['XChainAccountCreateCount'] as string | number;
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
      throw new ValidationError('XChainAddAccountCreateAttestation: invalid XChainBridge');
    if (!isAccount(this.Destination))
      throw new ValidationError('XChainAddAccountCreateAttestation: invalid Destination');
    if (!isAmount(this.Amount))
      throw new ValidationError('XChainAddAccountCreateAttestation: invalid Amount');
    if (!isString(this.AttestationPubKey))
      throw new ValidationError('XChainAddAccountCreateAttestation: missing AttestationPubKey');
    if (!isString(this.AttestationSignature))
      throw new ValidationError('XChainAddAccountCreateAttestation: missing AttestationSignature');
    if (!isAccount(this.AttestationRewardAccount))
      throw new ValidationError('XChainAddAccountCreateAttestation: invalid AttestationRewardAccount');
  }
}
