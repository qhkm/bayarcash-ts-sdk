/**
 * Basic Usage Examples for Bayarcash TypeScript SDK
 *
 * These examples demonstrate common use cases.
 * Remember to install dependencies: npm install bayarcash-ts-sdk
 */

import { Bayarcash, PaymentChannel, ValidationException } from 'bayarcash-ts-sdk';

// Configuration
const API_TOKEN = 'your_api_token_here';
const API_SECRET = 'your_secret_key_here';

// Initialize SDK with configuration
const bayarcash = new Bayarcash(API_TOKEN, {
  sandbox: true,      // Use sandbox for testing
  apiVersion: 'v3',   // Use v3 API
  timeout: 30000,     // Optional: Set request timeout in milliseconds
});

// Alternative: Initialize without config and set later
// const bayarcash = new Bayarcash(API_TOKEN);
// bayarcash.useSandbox();
// bayarcash.setApiVersion('v3');

/**
 * Example 1: Create a Payment Intent
 */
async function createPayment() {
    try {
        const paymentData = {
            payment_channel: PaymentChannel.FPX,
            order_number: 'ORDER-' + Date.now(),
            amount: 100.50,
            payer_name: 'John Doe',
            payer_email: 'john@example.com',
            payer_telephone_number: '+60123456789',
            callback_url: 'https://yoursite.com/api/callback',
            return_url: 'https://yoursite.com/payment/return',
        };

        // Generate checksum for security
        const checksum = bayarcash.createPaymentIntentChecksumValue(API_SECRET, paymentData);
        paymentData.checksum = checksum;

        // Create payment intent
        const payment = await bayarcash.createPaymentIntent(paymentData);

        console.log('Payment created:', payment.id);
        console.log('Redirect user to:', payment.url);

        return payment;
    } catch (error) {
        if (error instanceof ValidationException) {
            console.error('Validation errors:', error.errors);
        } else {
            console.error('Error:', error);
        }
        throw error;
    }
}

/**
 * Example 2: Get Transaction Details
 */
async function getTransactionDetails(transactionId: string) {
    try {
        const transaction = await bayarcash.getTransaction(transactionId);

        console.log('Transaction ID:', transaction.id);
        console.log('Order Number:', transaction.orderNumber);
        console.log('Amount:', transaction.amount);
        console.log('Status:', transaction.status);
        console.log('Payer:', transaction.payerName);

        return transaction;
    } catch (error) {
        console.error('Failed to get transaction:', error);
        throw error;
    }
}

/**
 * Example 3: List FPX Banks
 */
async function listFpxBanks() {
    try {
        const banks = await bayarcash.fpxBanksList();

        console.log('Available FPX Banks:');
        banks.forEach(bank => {
            console.log(`- ${bank.name} (${bank.code}): ${bank.status}`);
        });

        return banks;
    } catch (error) {
        console.error('Failed to list banks:', error);
        throw error;
    }
}

/**
 * Example 4: Verify Transaction Callback
 */
function verifyCallback(callbackData: any) {
    try {
        const isValid = bayarcash.verifyTransactionCallbackData(
            callbackData,
            API_SECRET
        );

        if (isValid) {
            console.log('Callback verified successfully');
            console.log('Transaction ID:', callbackData.transaction_id);
            console.log('Status:', callbackData.status);

            // Process the payment based on status
            if (callbackData.status === '3') {
                console.log('Payment successful!');
                // Update your database, send confirmation email, etc.
            }
        } else {
            console.error('Invalid callback checksum!');
        }

        return isValid;
    } catch (error) {
        console.error('Callback verification failed:', error);
        return false;
    }
}

/**
 * Example 5: Query Transactions (v3 API only)
 */
async function queryTransactions() {
    try {
        // Make sure we're using v3 API
        bayarcash.setApiVersion('v3');

        // Get transactions by order number
        const orderTransactions = await bayarcash.getTransactionByOrderNumber('ORDER-123');
        console.log('Transactions for ORDER-123:', orderTransactions.length);

        // Get transactions by status
        const successfulTxns = await bayarcash.getTransactionsByStatus('3');
        console.log('Successful transactions:', successfulTxns.length);

        // Get transactions with filters
        const result = await bayarcash.getAllTransactions({
            payment_channel: PaymentChannel.FPX,
            status: '3',
        });

        console.log('Filtered transactions:', result.data.length);
        console.log('Pagination:', result.meta);

        return result;
    } catch (error) {
        console.error('Failed to query transactions:', error);
        throw error;
    }
}

/**
 * Example 6: Get Available Portals and Channels
 */
async function getPortalInfo() {
    try {
        const portals = await bayarcash.getPortals();

        console.log('Available Portals:');
        for (const portal of portals) {
            console.log(`\nPortal: ${portal.name} (${portal.portalKey})`);

            const channels = await bayarcash.getChannels(portal.portalKey);
            console.log('Payment Channels:');
            channels.forEach(channel => {
                console.log(`  - ${channel.name}: ${channel.enabled ? 'Enabled' : 'Disabled'}`);
            });
        }

        return portals;
    } catch (error) {
        console.error('Failed to get portal info:', error);
        throw error;
    }
}

/**
 * Example 7: FPX Direct Debit Enrollment
 */
async function enrollDirectDebit() {
    try {
        const enrollmentData = {
            order_number: 'DD-' + Date.now(),
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
            API_SECRET,
            enrollmentData
        );
        enrollmentData.checksum = checksum;

        // Create enrollment
        const enrollment = await bayarcash.createFpxDirectDebitEnrollment(enrollmentData);

        console.log('Direct Debit Enrollment created:', enrollment.id);
        console.log('Redirect user to:', enrollment.url);

        return enrollment;
    } catch (error) {
        console.error('Failed to create enrollment:', error);
        throw error;
    }
}

// Run examples (uncomment to test)
async function main() {
    console.log('=== Bayarcash TypeScript SDK Examples ===\n');

    // Example 1: Create Payment
    // await createPayment();

    // Example 2: Get Transaction
    // await getTransactionDetails('your_transaction_id');

    // Example 3: List Banks
    // await listFpxBanks();

    // Example 4: Verify Callback
    // verifyCallback(callbackData);

    // Example 5: Query Transactions (v3)
    // await queryTransactions();

    // Example 6: Get Portal Info
    // await getPortalInfo();

    // Example 7: Direct Debit Enrollment
    // await enrollDirectDebit();
}

// Uncomment to run
// main().catch(console.error);

export {
    createPayment,
    getTransactionDetails,
    listFpxBanks,
    verifyCallback,
    queryTransactions,
    getPortalInfo,
    enrollDirectDebit,
};
