# Migration Guide: PHP SDK to TypeScript SDK

This guide helps you migrate from the Bayarcash PHP SDK to the TypeScript SDK.

## Installation

**PHP:**
```bash
composer require webimpian/bayarcash-php-sdk
```

**TypeScript:**
```bash
npm install bayarcash-ts-sdk
```

## Basic Setup

**PHP:**
```php
use Webimpian\BayarcashSdk\Bayarcash;

$bayarcash = new Bayarcash($token);
$bayarcash->useSandbox();
$bayarcash->setApiVersion('v3');
```

**TypeScript:**
```typescript
import { Bayarcash } from 'bayarcash-ts-sdk';

// Option 1: Pass config in constructor (recommended)
const bayarcash = new Bayarcash(token, {
  sandbox: true,
  apiVersion: 'v3',
  timeout: 30000
});

// Option 2: Configure after initialization
const bayarcash2 = new Bayarcash(token);
bayarcash2.useSandbox();
bayarcash2.setApiVersion('v3');
```

## Key Differences

### 1. Async/Await

All API calls in TypeScript are asynchronous and return Promises.

**PHP:**
```php
$banks = $bayarcash->fpxBanksList();
$transaction = $bayarcash->getTransaction('txn_id');
```

**TypeScript:**
```typescript
const banks = await bayarcash.fpxBanksList();
const transaction = await bayarcash.getTransaction('txn_id');
```

### 2. Error Handling

**PHP:**
```php
try {
    $payment = $bayarcash->createPaymentIntent($data);
} catch (ValidationException $e) {
    // Handle validation error
} catch (NotFoundException $e) {
    // Handle not found
}
```

**TypeScript:**
```typescript
import { ValidationException, NotFoundException } from 'bayarcash-ts-sdk';

try {
    const payment = await bayarcash.createPaymentIntent(data);
} catch (error) {
    if (error instanceof ValidationException) {
        // Handle validation error
    } else if (error instanceof NotFoundException) {
        // Handle not found
    }
}
```

### 3. Payment Channel Constants

**PHP:**
```php
Bayarcash::FPX
Bayarcash::DUITNOW_DOBW
```

**TypeScript:**
```typescript
Bayarcash.FPX
Bayarcash.DUITNOW_DOBW

// Or use the enum
import { PaymentChannel } from 'bayarcash-ts-sdk';
PaymentChannel.FPX
PaymentChannel.DUITNOW_DOBW
```

### 4. Type Safety

TypeScript provides full type checking:

```typescript
import { PaymentIntentRequest } from 'bayarcash-ts-sdk';

const data: PaymentIntentRequest = {
    payment_channel: Bayarcash.FPX,
    order_number: 'ORDER123',
    amount: 100.50,
    payer_name: 'John Doe',
    payer_email: 'john@example.com',
    // TypeScript will warn if you miss required fields
};
```

### 5. File Uploads

**PHP:**
```php
$data = [
    'proof_of_payment' => '/path/to/file.pdf',
    // ... other fields
];
```

**TypeScript (Browser):**
```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const data = {
    proof_of_payment: file, // File object
    // ... other fields
};
```

**TypeScript (Node.js 20+):**
```typescript
import { readFile } from 'fs/promises';

const fileBuffer = await readFile('/path/to/file.pdf');
const blob = new Blob([fileBuffer]);

const data = {
    proof_of_payment: blob,
    // ... other fields
};
```

### 6. Callback Verification

The API remains the same, but with TypeScript types:

**PHP:**
```php
$isValid = $bayarcash->verifyTransactionCallbackData($callbackData, $secretKey);
```

**TypeScript:**
```typescript
import { TransactionCallbackData } from 'bayarcash-ts-sdk';

const callbackData: TransactionCallbackData = {
    // ... callback fields
};

const isValid = bayarcash.verifyTransactionCallbackData(callbackData, secretKey);
```

### 7. Response Types

**PHP:**
```php
$transaction = $bayarcash->getTransaction('txn_id');
echo $transaction->orderNumber; // camelCase in resource
```

**TypeScript:**
```typescript
import { TransactionResource } from 'bayarcash-ts-sdk';

const transaction: TransactionResource = await bayarcash.getTransaction('txn_id');
console.log(transaction.orderNumber); // TypeScript knows the type
```

## Common Patterns

### Creating Payment Intent

**PHP:**
```php
$checksum = $bayarcash->createPaymentIntentChecksumValue($secretKey, $data);
$data['checksum'] = $checksum;
$response = $bayarcash->createPaymentIntent($data);
header("Location: " . $response->url);
```

**TypeScript:**
```typescript
const checksum = bayarcash.createPaymentIntentChecksumValue(secretKey, data);
data.checksum = checksum;

const response = await bayarcash.createPaymentIntent(data);

// Browser
window.location.href = response.url;

// Node.js/Express
res.redirect(response.url);
```

### Filtering Transactions (v3)

**PHP:**
```php
$transactions = $bayarcash->getAllTransactions([
    'order_number' => 'ORDER123',
    'status' => '3',
]);
```

**TypeScript:**
```typescript
const result = await bayarcash.getAllTransactions({
    order_number: 'ORDER123',
    status: '3',
});

const transactions = result.data;
const metadata = result.meta;
```

## Environment Variables

**PHP (.env):**
```
BAYARCASH_API_TOKEN=your_token
BAYARCASH_API_SECRET_KEY=your_secret
```

**TypeScript (.env):**
```
BAYARCASH_API_TOKEN=your_token
BAYARCASH_API_SECRET_KEY=your_secret
```

**Usage:**
```typescript
import * as dotenv from 'dotenv';
dotenv.config();

const bayarcash = new Bayarcash(process.env.BAYARCASH_API_TOKEN!);
```

## Testing

**PHP:**
```php
use PHPUnit\Framework\TestCase;

class BayarcashTest extends TestCase {
    public function testChecksum() {
        // ...
    }
}
```

**TypeScript (Jest):**
```typescript
import { ChecksumGenerator } from 'bayarcash-ts-sdk';

describe('Bayarcash', () => {
    it('should generate checksum', () => {
        const checksum = ChecksumGenerator.createPaymentIntentChecksumValue(
            secretKey,
            data
        );
        expect(checksum).toBeDefined();
    });
});
```

## Express.js Example (Node.js)

```typescript
import express from 'express';
import { Bayarcash, ValidationException } from 'bayarcash-ts-sdk';

const app = express();
app.use(express.json());

const bayarcash = new Bayarcash(process.env.BAYARCASH_API_TOKEN!, {
  sandbox: true
});

app.post('/create-payment', async (req, res) => {
    try {
        const payment = await bayarcash.createPaymentIntent(req.body);
        res.json({ url: payment.url });
    } catch (error) {
        if (error instanceof ValidationException) {
            res.status(422).json({ errors: error.errors });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.post('/callback', async (req, res) => {
    const isValid = bayarcash.verifyTransactionCallbackData(
        req.body,
        process.env.BAYARCASH_API_SECRET_KEY!
    );

    if (!isValid) {
        return res.status(400).json({ error: 'Invalid checksum' });
    }

    // Process payment...
    res.json({ success: true });
});

app.listen(3000);
```

## Summary of Changes

| Feature | PHP | TypeScript |
|---------|-----|------------|
| API Calls | Synchronous | Async (Promises) |
| Imports | `use` statements | ES6 `import` |
| Types | Docblocks | Native TypeScript |
| Arrays | `array()` | `[]` or `Array<T>` |
| Objects | Associative arrays | Objects/Interfaces |
| File Paths | String paths | File/Blob objects |
| Module System | Composer | NPM |
| Testing | PHPUnit | Jest |

## Need Help?

- Check the [README.md](./README.md) for full API documentation
- Review the [tests/](./tests/) directory for usage examples
- Refer to the [PHP SDK](https://github.com/webimpian/bayarcash-php-sdk) for comparison
