import CryptoJS from 'crypto-js';

export class ChecksumGenerator {
  /**
   * Generic checksum creator
   */
  public static createChecksumValue(
    secretKey: string,
    payload: Record<string, string | number>
  ): string {
    // Sort keys alphabetically
    const sortedKeys = Object.keys(payload).sort();

    // Create payload string with pipe delimiter
    const payloadString = sortedKeys.map((key) => payload[key]).join('|');

    // Generate HMAC-SHA256
    return CryptoJS.HmacSHA256(payloadString, secretKey).toString(CryptoJS.enc.Hex);
  }

  /**
   * Create payment intent checksum
   */
  public static createPaymentIntentChecksumValue(
    secretKey: string,
    data: {
      payment_channel: number;
      order_number: string;
      amount: number;
      payer_name: string;
      payer_email: string;
    }
  ): string {
    const payload = {
      payment_channel: data.payment_channel,
      order_number: data.order_number,
      amount: data.amount,
      payer_name: data.payer_name,
      payer_email: data.payer_email,
    };

    return this.createChecksumValue(secretKey, payload);
  }

  /**
   * Create payment intent checksum (with typo for backward compatibility)
   * @deprecated Use createPaymentIntentChecksumValue instead
   */
  public static createPaymentIntenChecksumValue(
    secretKey: string,
    data: {
      payment_channel: number;
      order_number: string;
      amount: number;
      payer_name: string;
      payer_email: string;
    }
  ): string {
    return this.createPaymentIntentChecksumValue(secretKey, data);
  }

  /**
   * Create FPX Direct Debit enrollment checksum
   */
  public static createFpxDirectDebitEnrolmentChecksumValue(
    secretKey: string,
    data: {
      order_number: string;
      amount: number;
      payer_name: string;
      payer_email: string;
      payer_telephone_number: string;
      payer_id_type: string;
      payer_id: string;
      application_reason: string;
      frequency_mode: string;
    }
  ): string {
    const payload = {
      order_number: data.order_number,
      amount: data.amount,
      payer_name: data.payer_name,
      payer_email: data.payer_email,
      payer_telephone_number: data.payer_telephone_number,
      payer_id_type: data.payer_id_type,
      payer_id: data.payer_id,
      application_reason: data.application_reason,
      frequency_mode: data.frequency_mode,
    };

    return this.createChecksumValue(secretKey, payload);
  }

  /**
   * Create FPX Direct Debit maintenance checksum
   */
  public static createFpxDirectDebitMaintenanceChecksumValue(
    secretKey: string,
    data: {
      amount: number;
      payer_email: string;
      payer_telephone_number: string;
      application_reason: string;
      frequency_mode: string;
    }
  ): string {
    const payload = {
      amount: data.amount,
      payer_email: data.payer_email,
      payer_telephone_number: data.payer_telephone_number,
      application_reason: data.application_reason,
      frequency_mode: data.frequency_mode,
    };

    return this.createChecksumValue(secretKey, payload);
  }
}
