import { ChecksumGenerator } from '../src/utils/ChecksumGenerator';

describe('ChecksumGenerator', () => {
  const secretKey = 'test_secret_key_12345';

  describe('createPaymentIntentChecksumValue', () => {
    it('should generate correct checksum for payment intent data', () => {
      const data = {
        payment_channel: 1,
        order_number: 'ORDER123',
        amount: 100.50,
        payer_name: 'John Doe',
        payer_email: 'john@example.com',
      };

      const checksum = ChecksumGenerator.createPaymentIntentChecksumValue(secretKey, data);

      expect(checksum).toBeDefined();
      expect(typeof checksum).toBe('string');
      expect(checksum.length).toBe(64); // SHA256 hash length
    });

    it('should generate consistent checksums for same data', () => {
      const data = {
        payment_channel: 1,
        order_number: 'ORDER123',
        amount: 100.50,
        payer_name: 'John Doe',
        payer_email: 'john@example.com',
      };

      const checksum1 = ChecksumGenerator.createPaymentIntentChecksumValue(secretKey, data);
      const checksum2 = ChecksumGenerator.createPaymentIntentChecksumValue(secretKey, data);

      expect(checksum1).toBe(checksum2);
    });

    it('should generate different checksums for different data', () => {
      const data1 = {
        payment_channel: 1,
        order_number: 'ORDER123',
        amount: 100.50,
        payer_name: 'John Doe',
        payer_email: 'john@example.com',
      };

      const data2 = {
        ...data1,
        order_number: 'ORDER456',
      };

      const checksum1 = ChecksumGenerator.createPaymentIntentChecksumValue(secretKey, data1);
      const checksum2 = ChecksumGenerator.createPaymentIntentChecksumValue(secretKey, data2);

      expect(checksum1).not.toBe(checksum2);
    });
  });

  describe('createFpxDirectDebitEnrolmentChecksumValue', () => {
    it('should generate correct checksum for FPX DD enrollment data', () => {
      const data = {
        order_number: 'DD-ORDER-001',
        amount: 50.00,
        payer_name: 'Jane Doe',
        payer_email: 'jane@example.com',
        payer_telephone_number: '+60123456789',
        payer_id_type: 'NRIC',
        payer_id: '920101015678',
        application_reason: 'Monthly subscription',
        frequency_mode: 'MONTHLY',
      };

      const checksum = ChecksumGenerator.createFpxDirectDebitEnrolmentChecksumValue(
        secretKey,
        data
      );

      expect(checksum).toBeDefined();
      expect(typeof checksum).toBe('string');
      expect(checksum.length).toBe(64);
    });
  });

  describe('createFpxDirectDebitMaintenanceChecksumValue', () => {
    it('should generate correct checksum for FPX DD maintenance data', () => {
      const data = {
        amount: 75.00,
        payer_email: 'jane@example.com',
        payer_telephone_number: '+60123456789',
        application_reason: 'Update subscription amount',
        frequency_mode: 'MONTHLY',
      };

      const checksum = ChecksumGenerator.createFpxDirectDebitMaintenanceChecksumValue(
        secretKey,
        data
      );

      expect(checksum).toBeDefined();
      expect(typeof checksum).toBe('string');
      expect(checksum.length).toBe(64);
    });
  });

  describe('backward compatibility', () => {
    it('createPaymentIntenChecksumValue should work (typo version)', () => {
      const data = {
        payment_channel: 1,
        order_number: 'ORDER123',
        amount: 100.50,
        payer_name: 'John Doe',
        payer_email: 'john@example.com',
      };

      const checksum = ChecksumGenerator.createPaymentIntenChecksumValue(secretKey, data);

      expect(checksum).toBeDefined();
      expect(typeof checksum).toBe('string');
      expect(checksum.length).toBe(64);
    });
  });
});
