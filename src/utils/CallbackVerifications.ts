import CryptoJS from 'crypto-js';
import {
  TransactionCallbackData,
  PreTransactionCallbackData,
  ReturnUrlCallbackData,
  DirectDebitBankApprovalCallbackData,
  DirectDebitAuthorizationCallbackData,
  DirectDebitTransactionCallbackData,
} from '../types';

export class CallbackVerifications {
  /**
   * Verify transaction callback data
   */
  public static verifyTransactionCallbackData(
    callbackData: TransactionCallbackData,
    secretKey: string
  ): boolean {
    const callbackChecksum = callbackData.checksum;

    const payload = {
      record_type: callbackData.record_type,
      transaction_id: callbackData.transaction_id,
      exchange_reference_number: callbackData.exchange_reference_number,
      exchange_transaction_id: callbackData.exchange_transaction_id,
      order_number: callbackData.order_number,
      currency: callbackData.currency,
      amount: callbackData.amount,
      payer_name: callbackData.payer_name,
      payer_email: callbackData.payer_email,
      payer_bank_name: callbackData.payer_bank_name,
      status: callbackData.status,
      status_description: callbackData.status_description,
      datetime: callbackData.datetime,
    };

    const generatedChecksum = this.generateChecksum(payload, secretKey);
    return generatedChecksum === callbackChecksum;
  }

  /**
   * Verify pre-transaction callback data
   */
  public static verifyPreTransactionCallbackData(
    callbackData: PreTransactionCallbackData,
    secretKey: string
  ): boolean {
    const callbackChecksum = callbackData.checksum;

    const payload = {
      record_type: callbackData.record_type,
      exchange_reference_number: callbackData.exchange_reference_number,
      order_number: callbackData.order_number,
    };

    const generatedChecksum = this.generateChecksum(payload, secretKey);
    return generatedChecksum === callbackChecksum;
  }

  /**
   * Verify return URL callback data
   */
  public static verifyReturnUrlCallbackData(
    callbackData: ReturnUrlCallbackData,
    secretKey: string
  ): boolean {
    const callbackChecksum = callbackData.checksum;

    const payload = {
      transaction_id: callbackData.transaction_id,
      exchange_reference_number: callbackData.exchange_reference_number,
      exchange_transaction_id: callbackData.exchange_transaction_id,
      order_number: callbackData.order_number,
      currency: callbackData.currency,
      amount: callbackData.amount,
      payer_bank_name: callbackData.payer_bank_name,
      status: callbackData.status,
      status_description: callbackData.status_description,
    };

    const generatedChecksum = this.generateChecksum(payload, secretKey);
    return generatedChecksum === callbackChecksum;
  }

  /**
   * Verify Direct Debit bank approval callback data
   */
  public static verifyDirectDebitBankApprovalCallbackData(
    callbackData: DirectDebitBankApprovalCallbackData,
    secretKey: string
  ): boolean {
    const callbackChecksum = callbackData.checksum;

    const payload = {
      record_type: callbackData.record_type,
      approval_date: callbackData.approval_date,
      approval_status: callbackData.approval_status,
      mandate_id: callbackData.mandate_id,
      mandate_reference_number: callbackData.mandate_reference_number,
      order_number: callbackData.order_number,
      payer_bank_code_hashed: callbackData.payer_bank_code_hashed,
      payer_bank_code: callbackData.payer_bank_code,
      payer_bank_account_no: callbackData.payer_bank_account_no,
      application_type: callbackData.application_type,
    };

    const generatedChecksum = this.generateChecksum(payload, secretKey);
    return generatedChecksum === callbackChecksum;
  }

  /**
   * Verify Direct Debit authorization callback data
   */
  public static verifyDirectDebitAuthorizationCallbackData(
    callbackData: DirectDebitAuthorizationCallbackData,
    secretKey: string
  ): boolean {
    const callbackChecksum = callbackData.checksum;

    const payload = {
      record_type: callbackData.record_type,
      transaction_id: callbackData.transaction_id,
      mandate_id: callbackData.mandate_id,
      exchange_reference_number: callbackData.exchange_reference_number,
      exchange_transaction_id: callbackData.exchange_transaction_id,
      order_number: callbackData.order_number,
      currency: callbackData.currency,
      amount: callbackData.amount,
      payer_name: callbackData.payer_name,
      payer_email: callbackData.payer_email,
      payer_bank_name: callbackData.payer_bank_name,
      status: callbackData.status,
      status_description: callbackData.status_description,
      datetime: callbackData.datetime,
    };

    const generatedChecksum = this.generateChecksum(payload, secretKey);
    return generatedChecksum === callbackChecksum;
  }

  /**
   * Verify Direct Debit transaction callback data
   */
  public static verifyDirectDebitTransactionCallbackData(
    callbackData: DirectDebitTransactionCallbackData,
    secretKey: string
  ): boolean {
    const callbackChecksum = callbackData.checksum;

    const payload = {
      record_type: callbackData.record_type,
      batch_number: callbackData.batch_number,
      mandate_id: callbackData.mandate_id,
      mandate_reference_number: callbackData.mandate_reference_number,
      transaction_id: callbackData.transaction_id,
      datetime: callbackData.datetime,
      reference_number: callbackData.reference_number,
      amount: callbackData.amount,
      status: callbackData.status,
      status_description: callbackData.status_description,
      cycle: callbackData.cycle,
    };

    const generatedChecksum = this.generateChecksum(payload, secretKey);
    return generatedChecksum === callbackChecksum;
  }

  /**
   * Generate checksum from payload
   */
  private static generateChecksum(
    payload: Record<string, string | number>,
    secretKey: string
  ): string {
    // Sort keys alphabetically
    const sortedKeys = Object.keys(payload).sort();

    // Create payload string with pipe delimiter
    const payloadString = sortedKeys.map((key) => payload[key]).join('|');

    // Generate HMAC-SHA256
    return CryptoJS.HmacSHA256(payloadString, secretKey).toString(CryptoJS.enc.Hex);
  }
}
