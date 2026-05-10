/**
 * NFTokenBurn transaction — permanently remove an NFToken from the ledger.
 *
 * @see https://xrpl.org/nftokenburn.html
 */
import type { BaseTransactionFields } from '../types/base.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString, isAccount } from '../validation/helpers.js';

export interface NFTokenBurnTxFields extends BaseTransactionFields {
  readonly TransactionType: 'NFTokenBurn';
  /** The unique identifier of the NFToken to burn. */
  readonly NFTokenID: string;
  /** The account that currently owns the token (if not the sender). */
  readonly Owner?: string;
}

export class NFTokenBurnTx extends TokenTransaction {
  override readonly TransactionType = 'NFTokenBurn' as const;

  /** The unique identifier of the NFToken to burn. */
  readonly NFTokenID: string = undefined as any;

  /** The account that currently owns the token (if not the sender). */
  readonly Owner?: string = undefined;

  constructor(props: NFTokenBurnTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'NFTokenBurn' } as BaseTransactionFields);
    this.NFTokenID = p['NFTokenID'] as string;
    assignDefined(this, p, ['Owner']);
  }

  override affectsTokenBalance(): boolean { return true; }

  override validate(): void {
    super.validate();
    if (!isString(this.NFTokenID)) {
      throw new ValidationError('NFTokenBurn: missing or invalid NFTokenID');
    }
    if (this.Owner !== undefined && !isAccount(this.Owner)) {
      throw new ValidationError('NFTokenBurn: invalid Owner');
    }
  }
}
