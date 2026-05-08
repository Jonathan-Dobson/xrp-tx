/**
 * LoanTransaction — intermediate abstract class for loan transactions.
 */
import { Transaction } from '../transaction.js';

export abstract class LoanTransaction extends Transaction {
  // Shared lending/broker logic can be added here.
}
