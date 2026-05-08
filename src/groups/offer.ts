/**
 * OfferTransaction — intermediate abstract class for DEX offer transactions.
 *
 * Covers: OfferCreate, OfferCancel
 */
import { Transaction } from '../transaction.js';

export abstract class OfferTransaction extends Transaction {
  // Shared offer logic can be added here as the DEX evolves.
}
