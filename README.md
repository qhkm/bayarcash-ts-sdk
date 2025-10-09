# Bayarcash Payment Gateway TypeScript SDK

A TypeScript/JavaScript SDK for integrating with [Bayarcash](https://bayarcash.com/) Payment Gateway API. This SDK supports both API v2 and v3, providing a type-safe interface for payment processing across Malaysia, Singapore, and Indonesia.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all API interactions
- ✅ **Multiple Payment Channels** - FPX, DuitNow, Direct Debit, Manual Transfer, and more
- ✅ **API v2 & v3 Support** - Compatible with both versions of Bayarcash API
- ✅ **Checksum Security** - Built-in HMAC-SHA256 checksum generation and verification
- ✅ **Callback Verification** - Secure webhook data validation
- ✅ **ESM & CommonJS** - Works with both module systems
- ✅ **Node.js 20+** - Modern JavaScript runtime support

## Installation

```bash
npm install bayarcash-ts-sdk
```

## Quick Start

### Basic Setup

```typescript
import { Bayarcash, PaymentChannel } from 'bayarcash-ts-sdk';

// Option 1: Initialize with configuration object (recommended)
const bayarcash = new Bayarcash('your_api_token_here', {
  sandbox: true,      // Use sandbox environment for testing
  apiVersion: 'v3',   // Use v3 API (optional, defaults to v2)
  timeout: 30000,     // Request timeout in milliseconds (optional, defaults to 30000)
});

// Option 2: Initialize then configure
const bayarcash2 = new Bayarcash('your_api_token_here');
bayarcash2.useSandbox();          // Use sandbox environment
bayarcash2.setApiVersion('v3');   // Set API version
bayarcash2.setTimeout(30000);     // Set timeout
```

### Create a Payment Intent

```typescript
const paymentData = {
  payment_channel: PaymentChannel.FPX,
  order_number: 'ORDER-' + Date.now(),
  amount: 100.50,
  payer_name: 'John Doe',
  payer_email: 'john@example.com',
  payer_telephone_number: '+60123456789',
  callback_url: 'https://yoursite.com/callback',
  return_url: 'https://yoursite.com/return',
};

// Generate checksum for security (recommended)
const checksum = bayarcash.createPaymentIntentChecksumValue(
  'your_secret_key',
  paymentData
);

// Add checksum to payment data
paymentData.checksum = checksum;

// Create payment intent
const paymentIntent = await bayarcash.createPaymentIntent(paymentData);

// Redirect user to payment page
console.log('Redirect to:', paymentIntent.url);
```

## Available Payment Channels

```typescript
Bayarcash.FPX                 // FPX Online Banking
Bayarcash.FPX_DIRECT_DEBIT   // FPX Direct Debit
Bayarcash.FPX_LINE_OF_CREDIT // FPX Line of Credit
Bayarcash.DUITNOW_DOBW       // DuitNow Online Banking
Bayarcash.DUITNOW_QR         // DuitNow QR
Bayarcash.SPAYLATER          // ShopeePayLater
Bayarcash.BOOST_PAYFLEX      // Boost PayFlex
Bayarcash.QRISOB            // QRIS Online Banking
Bayarcash.QRISWALLET        // QRIS Wallet
Bayarcash.NETS              // NETS
Bayarcash.CREDIT_CARD       // Credit Card
Bayarcash.ALIPAY            // Alipay
Bayarcash.WECHATPAY         // WeChat Pay
Bayarcash.PROMPTPAY         // PromptPay
```

## Core Features

### Portal Management

```typescript
// Get all available portals
const portals = await bayarcash.getPortals();

// Get payment channels for a specific portal
const channels = await bayarcash.getChannels('your_portal_key');
```

### FPX Bank Integration

```typescript
// Get list of available FPX banks
const banks = await bayarcash.fpxBanksList();
```

### Transaction Management

```typescript
// Get single transaction
const transaction = await bayarcash.getTransaction('transaction_id');

// V3 API Features
if (bayarcash.getApiVersion() === 'v3') {
  // Get all transactions with filters
  const result = await bayarcash.getAllTransactions({
    order_number: 'ORDER123',
    status: '3',
    payment_channel: Bayarcash.FPX,
    payer_email: 'customer@example.com'
  });

  console.log('Transactions:', result.data);
  console.log('Metadata:', result.meta);

  // Specialized queries
  const orderTxns = await bayarcash.getTransactionByOrderNumber('ORDER123');
  const emailTxns = await bayarcash.getTransactionsByPayerEmail('customer@example.com');
  const statusTxns = await bayarcash.getTransactionsByStatus('3');
  const channelTxns = await bayarcash.getTransactionsByPaymentChannel(Bayarcash.FPX);
  const refTxn = await bayarcash.getTransactionByReferenceNumber('REF123');
}
```

### Payment Intent Management (V3 Only)

```typescript
// Get payment intent details
bayarcash.setApiVersion('v3');
const paymentIntent = await bayarcash.getPaymentIntent('payment_intent_id');
```

### Callback Verification

Verify the authenticity of callback data from Bayarcash:

```typescript
// Transaction callback
const isValid = bayarcash.verifyTransactionCallbackData(
  callbackData,
  'your_secret_key'
);

// Pre-transaction callback
const isValidPre = bayarcash.verifyPreTransactionCallbackData(
  preCallbackData,
  'your_secret_key'
);

// Return URL callback
const isValidReturn = bayarcash.verifyReturnUrlCallbackData(
  returnUrlData,
  'your_secret_key'
);
```

### FPX Direct Debit

#### Enrollment

```typescript
const enrollmentData = {
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

// Generate checksum
const checksum = bayarcash.createFpxDirectDebitEnrolmentChecksumValue(
  'your_secret_key',
  enrollmentData
);

enrollmentData.checksum = checksum;

// Create enrollment
const enrollment = await bayarcash.createFpxDirectDebitEnrollment(enrollmentData);
```

#### Maintenance

```typescript
const maintenanceData = {
  amount: 75.00,
  payer_email: 'jane@example.com',
  payer_telephone_number: '+60123456789',
  application_reason: 'Update subscription amount',
  frequency_mode: 'MONTHLY',
};

const checksum = bayarcash.createFpxDirectDebitMaintenanceChecksumValue(
  'your_secret_key',
  maintenanceData
);

maintenanceData.checksum = checksum;

const maintenance = await bayarcash.createFpxDirectDebitMaintenance(
  'mandate_id',
  maintenanceData
);
```

#### Termination

```typescript
const termination = await bayarcash.createFpxDirectDebitTermination('mandate_id', {});
```

### Manual Bank Transfer

```typescript
const transferData = {
  portal_key: 'your_portal_key',
  buyer_name: 'John Doe',
  buyer_email: 'john@example.com',
  order_amount: 200.00,
  order_no: 'MT-ORDER-001',
  payment_gateway: 2, // Must be 2 for manual transfers
  merchant_bank_name: 'Maybank',
  merchant_bank_account: '1234567890',
  merchant_bank_account_holder: 'Your Company',
  bank_transfer_type: 'IBG',
  bank_transfer_notes: 'Payment for order MT-ORDER-001',
  bank_transfer_date: '2025-01-15',
  proof_of_payment: fileBlob, // File or Blob object
};

const result = await bayarcash.createManualBankTransfer(transferData);

// Update transfer status
await bayarcash.updateManualBankTransferStatus(
  'reference_number',
  'completed',
  '200.00'
);
```

## Error Handling

The SDK provides typed exceptions for different error scenarios:

```typescript
import {
  ValidationException,
  NotFoundException,
  FailedActionException,
  RateLimitExceededException,
  TimeoutException
} from 'bayarcash-ts-sdk';

try {
  const payment = await bayarcash.createPaymentIntent(data);
} catch (error) {
  if (error instanceof ValidationException) {
    console.error('Validation errors:', error.errors);
  } else if (error instanceof NotFoundException) {
    console.error('Resource not found');
  } else if (error instanceof RateLimitExceededException) {
    console.error('Rate limit exceeded, resets at:', error.resetAt);
  }
}
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import {
  Bayarcash,
  PaymentChannel,
  PaymentIntentRequest,
  TransactionResponse,
  FpxBankResponse,
  PortalResponse,
  // ... and many more
} from 'bayarcash-ts-sdk';
```

## API Reference

### Main Class Methods

| Method | Description | API Version |
|--------|-------------|-------------|
| `useSandbox()` | Switch to sandbox environment | All |
| `setApiVersion(version)` | Set API version ('v2' or 'v3') | All |
| `setTimeout(ms)` | Set request timeout | All |
| `createPaymentIntent(data)` | Create payment intent | All |
| `getPaymentIntent(id)` | Get payment intent details | v3 only |
| `getTransaction(id)` | Get transaction by ID | All |
| `getAllTransactions(params)` | Get filtered transactions | v3 only |
| `fpxBanksList()` | Get FPX banks | All |
| `getPortals()` | Get all portals | All |
| `getChannels(portalKey)` | Get portal channels | All |

### Checksum Generation

| Method | Description |
|--------|-------------|
| `createPaymentIntentChecksumValue(secret, data)` | Generate payment intent checksum |
| `createFpxDirectDebitEnrolmentChecksumValue(secret, data)` | Generate DD enrollment checksum |
| `createFpxDirectDebitMaintenanceChecksumValue(secret, data)` | Generate DD maintenance checksum |

### Callback Verification

| Method | Description |
|--------|-------------|
| `verifyTransactionCallbackData(data, secret)` | Verify transaction callback |
| `verifyPreTransactionCallbackData(data, secret)` | Verify pre-transaction callback |
| `verifyReturnUrlCallbackData(data, secret)` | Verify return URL callback |

## Security Best Practices

1. ✅ Always use checksums for payment requests
2. ✅ Verify all callbacks using the verification methods
3. ✅ Store and validate transaction IDs to prevent duplicates
4. ✅ Keep your API tokens and secret keys secure (use environment variables)
5. ✅ Use HTTPS for all API communications (handled by SDK)

## Migration from PHP SDK

Key differences from the PHP SDK:

- **Async/Await**: All API methods are asynchronous and return Promises
- **Type Safety**: Full TypeScript support with IntelliSense
- **Error Handling**: Use try/catch instead of PHP exceptions
- **Imports**: Use ES6 import syntax
- **File Uploads**: Use File/Blob objects instead of file paths

## Requirements

- Node.js 20 or higher
- TypeScript 5.0+ (for TypeScript projects)

## License

MIT

## Support

For support questions, please contact Bayarcash support or raise an issue in the repository.

## Official Documentation

For detailed API documentation, visit: [Bayarcash API Documentation](https://api.webimpian.support/bayarcash)
