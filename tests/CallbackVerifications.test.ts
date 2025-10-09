import { CallbackVerifications } from '../src/utils/CallbackVerifications';
import { ChecksumGenerator } from '../src/utils/ChecksumGenerator';

describe('CallbackVerifications', () => {
  const secretKey = 'test_secret_key_12345';

  describe('verifyTransactionCallbackData', () => {
    it('should verify valid transaction callback data', () => {
      const callbackData = {
        record_type: 'transaction',
        transaction_id: 'TXN123',
        exchange_reference_number: 'REF123',
        exchange_transaction_id: 'EXT123',
        order_number: 'ORDER123',
        currency: 'MYR',
        amount: '100.50',
        payer_name: 'John Doe',
        payer_email: 'john@example.com',
        payer_bank_name: 'Maybank',
        status: '3',
        status_description: 'Successful',
        datetime: '2025-01-15 10:30:00',
      };

      // Generate a valid checksum
      const payload = { ...callbackData };
      const checksum = ChecksumGenerator.createChecksumValue(secretKey, payload as any);

      const dataWithChecksum = { ...callbackData, checksum };

      const isValid = CallbackVerifications.verifyTransactionCallbackData(
        dataWithChecksum,
        secretKey
      );

      expect(isValid).toBe(true);
    });

    it('should reject invalid transaction callback data', () => {
      const callbackData = {
        record_type: 'transaction',
        transaction_id: 'TXN123',
        exchange_reference_number: 'REF123',
        exchange_transaction_id: 'EXT123',
        order_number: 'ORDER123',
        currency: 'MYR',
        amount: '100.50',
        payer_name: 'John Doe',
        payer_email: 'john@example.com',
        payer_bank_name: 'Maybank',
        status: '3',
        status_description: 'Successful',
        datetime: '2025-01-15 10:30:00',
        checksum: 'invalid_checksum_here',
      };

      const isValid = CallbackVerifications.verifyTransactionCallbackData(
        callbackData,
        secretKey
      );

      expect(isValid).toBe(false);
    });
  });

  describe('verifyPreTransactionCallbackData', () => {
    it('should verify valid pre-transaction callback data', () => {
      const callbackData = {
        record_type: 'pre_transaction',
        exchange_reference_number: 'REF123',
        order_number: 'ORDER123',
      };

      const payload = { ...callbackData };
      const checksum = ChecksumGenerator.createChecksumValue(secretKey, payload as any);

      const dataWithChecksum = { ...callbackData, checksum };

      const isValid = CallbackVerifications.verifyPreTransactionCallbackData(
        dataWithChecksum,
        secretKey
      );

      expect(isValid).toBe(true);
    });
  });

  describe('verifyReturnUrlCallbackData', () => {
    it('should verify valid return URL callback data', () => {
      const callbackData = {
        transaction_id: 'TXN123',
        exchange_reference_number: 'REF123',
        exchange_transaction_id: 'EXT123',
        order_number: 'ORDER123',
        currency: 'MYR',
        amount: '100.50',
        payer_bank_name: 'Maybank',
        status: '3',
        status_description: 'Successful',
      };

      const payload = { ...callbackData };
      const checksum = ChecksumGenerator.createChecksumValue(secretKey, payload as any);

      const dataWithChecksum = { ...callbackData, checksum };

      const isValid = CallbackVerifications.verifyReturnUrlCallbackData(
        dataWithChecksum,
        secretKey
      );

      expect(isValid).toBe(true);
    });
  });
});
