/**
 * PermissionedDomainTransaction — intermediate abstract class.
 */
import { Transaction } from '../transaction.js';

export abstract class PermissionedDomainTransaction extends Transaction {
  // Shared permissioned domain logic can be added here.
}
