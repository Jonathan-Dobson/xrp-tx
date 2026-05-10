/**
 * NFTokenAcceptOffer transaction — accept an offer to buy or sell an NFToken.
 *
 * @see https://xrpl.org/nftokenacceptoffer.html
 */
import type { Amount } from '../types/amounts.js';
import type { BaseTransactionFields } from '../types/base.js';
import { TokenTransaction } from '../groups/token.js';
import { assignDefined } from '../transaction.js';
import { ValidationError } from '../errors.js';
import { isString, isAmount } from '../validation/helpers.js';

export interface NFTokenAcceptOfferTxFields extends BaseTransactionFields {
  readonly TransactionType: 'NFTokenAcceptOffer';
  /** The unique identifier of the Sell offer to accept. */
  readonly NFTokenSellOffer?: string;
  /** The unique identifier of the Buy offer to accept. */
  readonly NFTokenBuyOffer?: string;
  /** Fee paid to a broker for facilitating the trade. */
  readonly NFTokenBrokerFee?: Amount;
}

export class NFTokenAcceptOfferTx extends TokenTransaction {
  override readonly TransactionType = 'NFTokenAcceptOffer' as const;

  readonly NFTokenSellOffer?: string = undefined;
  readonly NFTokenBuyOffer?: string = undefined;
  readonly NFTokenBrokerFee?: Amount = undefined;

  constructor(props: NFTokenAcceptOfferTxFields | Record<string, unknown>) {
    const p = props as Record<string, unknown>;
    super({ ...p, TransactionType: 'NFTokenAcceptOffer' } as BaseTransactionFields);
    assignDefined(this, p, ['NFTokenSellOffer', 'NFTokenBuyOffer', 'NFTokenBrokerFee']);
  }

  override affectsTokenBalance(): boolean { return true; }

  override validate(): void {
    super.validate();
    if (this.NFTokenSellOffer === undefined && this.NFTokenBuyOffer === undefined)
      throw new ValidationError('NFTokenAcceptOffer: must have NFTokenSellOffer or NFTokenBuyOffer');
    if (this.NFTokenSellOffer !== undefined && !isString(this.NFTokenSellOffer))
      throw new ValidationError('NFTokenAcceptOffer: invalid NFTokenSellOffer');
    if (this.NFTokenBuyOffer !== undefined && !isString(this.NFTokenBuyOffer))
      throw new ValidationError('NFTokenAcceptOffer: invalid NFTokenBuyOffer');
    if (this.NFTokenBrokerFee !== undefined && !isAmount(this.NFTokenBrokerFee))
      throw new ValidationError('NFTokenAcceptOffer: invalid NFTokenBrokerFee');
  }
}
