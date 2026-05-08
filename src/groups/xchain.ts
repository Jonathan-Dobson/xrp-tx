/**
 * XChainTransaction — intermediate abstract class for cross-chain transactions.
 */
import { Transaction } from '../transaction.js';

export abstract class XChainTransaction extends Transaction {
  // Shared bridge/attestation logic can be added here.
}
