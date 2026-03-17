# Bayarcash TypeScript SDK

TypeScript SDK for the [Bayarcash](https://bayarcash.com/) payment gateway API (Malaysia, Singapore, Indonesia). Ported from the official PHP SDK.

## Quick Commands

```bash
npm run build          # Build CJS + ESM + types to dist/
npm test               # Run Jest tests
npm run test:coverage  # Tests with coverage report (70% threshold)
npm run lint           # ESLint on src/**/*.ts
npm run format         # Prettier on src/**/*.ts
```

## Architecture

```
src/
├── Bayarcash.ts                    # Main SDK class - entry point, all public methods
├── index.ts                        # Barrel exports
├── types/index.ts                  # All TypeScript interfaces and enums
├── resources/                      # Response wrapper classes (snake_case → camelCase)
│   ├── Resource.ts                 # Abstract base - auto-fills camelCase properties
│   ├── PaymentIntentResource.ts
│   ├── TransactionResource.ts
│   ├── FpxBankResource.ts
│   ├── PortalResource.ts
│   ├── FpxDirectDebitResource.ts
│   └── FpxDirectDebitApplicationResource.ts
├── actions/                        # Domain-specific action groups
│   ├── FpxDirectDebitActions.ts    # Mandate CRUD via HttpClient
│   └── ManualBankTransferActions.ts # FormData-based bank transfers (direct axios)
├── utils/
│   ├── HttpClient.ts               # Axios wrapper with error mapping
│   ├── ChecksumGenerator.ts        # HMAC-SHA256 checksum creation
│   └── CallbackVerifications.ts    # Webhook signature verification
└── exceptions/index.ts             # Typed errors: Validation(422), NotFound(404), etc.

tests/                               # Jest tests (ts-jest preset)
examples/basic-usage.ts              # Usage examples (not runnable without API key)
```

## Key Patterns

- **Bayarcash class** is the single entry point. All API methods live here.
- **Resource classes** wrap API responses, converting `snake_case` keys to `camelCase` properties via the `Resource.fill()` method.
- **HttpClient** handles auth headers, base URL switching (sandbox/production, v2/v3), and maps HTTP status codes to typed exceptions.
- **ManualBankTransferActions** uses its own axios instance (not HttpClient) because it posts FormData to a different URL pattern.
- **Checksum generation** sorts payload keys alphabetically, joins values with `|`, then HMAC-SHA256 signs with the secret key.
- **Backward compatibility**: `createPaymentIntenChecksumValue` (typo) and `getfpxDirectDebitransaction` (typo) are kept for PHP SDK parity.

## API Environments

| Version | Production | Sandbox |
|---------|-----------|---------|
| v2 | `console.bayar.cash/api/v2/` | `console.bayarcash-sandbox.com/api/v2/` |
| v3 | `api.console.bayar.cash/v3/` | `api.console.bayarcash-sandbox.com/v3/` |

- v3-only methods: `getPaymentIntent`, `getAllTransactions`, `getTransactionByOrderNumber`, `getTransactionsByPayerEmail`, `getTransactionsByStatus`, `getTransactionsByPaymentChannel`, `getTransactionByReferenceNumber`

## Build Output

Dual-format: CJS (`dist/index.js`) + ESM (`dist/index.mjs`) + types (`dist/index.d.ts`). Published to npm as `bayarcash-ts-sdk`.

## Dependencies

- **axios** - HTTP client
- **crypto-js** - HMAC-SHA256 for checksums and callback verification

## Conventions

- Strict TypeScript (`strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`)
- Target ES2020, Node.js >= 20
- Tests in `tests/` directory using Jest with ts-jest
- All API methods return Promises
- Error handling via custom exception classes mapped from HTTP status codes
