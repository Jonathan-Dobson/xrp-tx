/**
 * AccountTransaction — intermediate abstract class for account-modifying transactions.
 *
 * Covers: AccountSet, AccountDelete, SetRegularKey, SignerListSet,
 *         DelegateSet, DepositPreauth, TicketCreate, Clawback
 */
import { Transaction } from '../transaction.js';

export abstract class AccountTransaction extends Transaction {
  /**
   * Account transactions always require a sequence number
   * (or ticket) to be valid.
   */
  requiresSequence(): boolean {
    return true;
  }
}
