/**
 * SignerListSet transaction — create, replace, or remove a multi-signature signer list.
 *
 * @see https://xrpl.org/signerlistset.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import type { SignerEntry } from '../types/common.js';
import { AccountTransaction } from '../groups/account.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isNumber, isRecord, isString, isArray } from '../validation/helpers.js';

export interface SignerListSetTxFields extends BaseTransactionFields {
  readonly TransactionType: 'SignerListSet';
  /** The target number of weights required to authorize a transaction (0 to delete). */
  readonly SignerQuorum: number;
  /** Up to 32 signer entries. */
  readonly SignerEntries?: SignerEntry[];
}

function isSignerEntry(value: unknown): value is SignerEntry {
  if (!isRecord(value)) return false;
  const entry = value['SignerEntry'];
  if (!isRecord(entry)) return false;
  return isString(entry['Account']) && isNumber(entry['SignerWeight']);
}

export class SignerListSetTx extends AccountTransaction {
  override readonly TransactionType = 'SignerListSet' as const;

  /** The target number of weights required. */
  readonly SignerQuorum: number = undefined as any;

  /** Up to 32 signer entries. */
  readonly SignerEntries?: SignerEntry[] = undefined;

  constructor(props: SignerListSetTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'SignerListSet' } as BaseTransactionFields);
    this.SignerQuorum = p['SignerQuorum'] as number;
    assignDefined(this, p, ['SignerEntries']);
  }

  override validate(): void {
    super.validate();
    if (!isNumber(this.SignerQuorum))
      throw new ValidationError('SignerListSet: missing or invalid SignerQuorum');
    if (this.SignerQuorum === 0 && this.SignerEntries != null && this.SignerEntries.length > 0)
      throw new ValidationError('SignerListSet: SignerQuorum must be > 0 when SignerEntries are present');
    if (this.SignerEntries !== undefined) {
      if (!isArray(this.SignerEntries) || !this.SignerEntries.every(isSignerEntry))
        throw new ValidationError('SignerListSet: invalid SignerEntries');
    }
  }
}
