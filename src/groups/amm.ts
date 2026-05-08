/**
 * AMMTransaction — intermediate abstract class for AMM transactions.
 */
import { Transaction } from '../transaction.js';

export abstract class AMMTransaction extends Transaction {
  // Shared AMM logic (Asset/Asset2 patterns) can be added here.
}
