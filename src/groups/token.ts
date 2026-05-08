/**
 * TokenTransaction — intermediate abstract class for token-related transactions.
 *
 * Covers: NFTokenMint, NFTokenBurn, NFTokenCreateOffer, NFTokenCancelOffer,
 *         NFTokenAcceptOffer, NFTokenModify, MPToken*, TrustSet
 */
import { Transaction } from '../transaction.js';

export abstract class TokenTransaction extends Transaction {
  /**
   * Whether this transaction affects token balances.
   * Used for categorization and lifecycle tracking.
   */
  abstract affectsTokenBalance(): boolean;
}
