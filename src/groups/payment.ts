/**
 * PaymentTransaction — intermediate abstract class for value-transfer transactions.
 *
 * Covers: Payment, CheckCreate, CheckCash, CheckCancel,
 *         EscrowCreate, EscrowFinish, EscrowCancel, PaymentChannel*
 */
import type { Amount } from '../types/amounts.js';
import { Transaction } from '../transaction.js';
import { ValidationError } from '../errors.js';

export abstract class PaymentTransaction extends Transaction {
  /**
   * Get the primary amount being transferred.
   * Implemented by each concrete payment-like transaction.
   */
  abstract getAmount(): Amount;

  /**
   * Get the destination address.
   * Implemented by each concrete payment-like transaction.
   */
  abstract getDestination(): string;

  /**
   * Validate common payment rules.
   * Called as part of the validate() chain.
   */
  protected validatePaymentRules(): void {
    const amount = this.getAmount();
    if (amount === undefined || amount === null) {
      throw new ValidationError(`${this.TransactionType}: missing Amount`);
    }

    const dest = this.getDestination();
    if (!dest) {
      throw new ValidationError(`${this.TransactionType}: missing Destination`);
    }
  }

  override validate(): void {
    super.validate();
    this.validatePaymentRules();
  }
}
