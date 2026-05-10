/**
 * CredentialCreate transaction — issue a new digital credential to an account.
 *
 * @see https://xrpl.org/credentialcreate.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import { Transaction, assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isAccount, isString, isNumber } from '../validation/helpers.js';

export interface CredentialCreateTxFields extends BaseTransactionFields {
  readonly TransactionType: 'CredentialCreate';
  /** The account receiving the credential. */
  readonly Subject: string;
  /** Type of the credential. */
  readonly CredentialType: string;
  /** Sequence number for the credential. */
  readonly CredentialSequence: number;
  /** Optional expiration. */
  readonly Expiration?: number;
  /** Optional metadata URI. */
  readonly URI?: string;
}

export class CredentialCreateTx extends Transaction {
  override readonly TransactionType = 'CredentialCreate' as const;

  readonly Subject: string = undefined as any;
  readonly CredentialType: string = undefined as any;
  readonly CredentialSequence: number = undefined as any;
  readonly Expiration?: number = undefined;
  readonly URI?: string = undefined;

  constructor(props: CredentialCreateTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'CredentialCreate' } as BaseTransactionFields);
    this.Subject = p['Subject'] as string;
    this.CredentialType = p['CredentialType'] as string;
    this.CredentialSequence = p['CredentialSequence'] as number;
    assignDefined(this, p, ['Expiration', 'URI']);
  }

  override validate(): void {
    super.validate();
    if (!isAccount(this.Subject)) throw new ValidationError('CredentialCreate: missing or invalid Subject');
    if (!isString(this.CredentialType)) throw new ValidationError('CredentialCreate: missing or invalid CredentialType');
    if (!isNumber(this.CredentialSequence)) throw new ValidationError('CredentialCreate: missing or invalid CredentialSequence');
  }
}
