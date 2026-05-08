/**
 * NFTokenModify transaction — modify an existing NFToken.
 */
import type { BaseTransactionFields } from '../types/base.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString, isAccount } from '../validation/helpers.js';

export interface NFTokenModifyTxFields extends BaseTransactionFields {
  readonly TransactionType: 'NFTokenModify';
  readonly NFTokenID: string;
  readonly Owner?: string;
  readonly URI?: string;
}

export class NFTokenModifyTx extends TokenTransaction {
  override readonly TransactionType = 'NFTokenModify' as const;
  readonly NFTokenID!: string;
  readonly Owner?: string;
  readonly URI?: string;

  constructor(props: NFTokenModifyTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'NFTokenModify' } as BaseTransactionFields);
    this.NFTokenID = p['NFTokenID'] as string;
    assignDefined(this, p, ['Owner', 'URI']);
  }

  override affectsTokenBalance(): boolean { return false; }

  override validate(): void {
    super.validate();
    if (!isString(this.NFTokenID))
      throw new ValidationError('NFTokenModify: missing NFTokenID');
    if (this.Owner !== undefined && !isAccount(this.Owner))
      throw new ValidationError('NFTokenModify: invalid Owner');
    if (this.URI !== undefined && !isString(this.URI))
      throw new ValidationError('NFTokenModify: URI must be a string');
  }
}
