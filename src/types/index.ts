/**
 * Payment channel identifiers
 */
export enum PaymentChannel {
  FPX = 1,
  MANUAL_TRANSFER = 2,
  FPX_DIRECT_DEBIT = 3,
  FPX_LINE_OF_CREDIT = 4,
  DUITNOW_DOBW = 5,
  DUITNOW_QR = 6,
  SPAYLATER = 7,
  BOOST_PAYFLEX = 8,
  QRISOB = 9,
  QRISWALLET = 10,
  NETS = 11,
  CREDIT_CARD = 12,
  ALIPAY = 13,
  WECHATPAY = 14,
  PROMPTPAY = 15,
}

/**
 * API version type
 */
export type ApiVersion = 'v2' | 'v3';

/**
 * Environment type
 */
export type Environment = 'production' | 'sandbox';

/**
 * Payment intent request data
 */
export interface PaymentIntentRequest {
  payment_channel: PaymentChannel | number;
  order_number: string;
  amount: number;
  payer_name: string;
  payer_email: string;
  payer_telephone_number?: string;
  currency?: string;
  callback_url?: string;
  return_url?: string;
  metadata?: Record<string, any>;
  checksum?: string;
}

/**
 * Payment intent response data
 */
export interface PaymentIntentResponse {
  payer_name: string;
  payer_email: string;
  payer_telephone_number?: string | null;
  order_number: string;
  amount: number;
  url: string;
  type: string;
  id: string;
  status: string;
  last_attempt?: any;
  paid_at?: string | null;
  currency: string;
  attempts: any[];
}

/**
 * Transaction response data
 */
export interface TransactionResponse {
  id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  datetime?: string | null;
  payer_name?: string | null;
  payer_email?: string | null;
  payer_telephone_number?: string | null;
  order_number?: string | null;
  currency?: string | null;
  amount?: number | null;
  exchange_reference_number?: string | null;
  exchange_transaction_id?: string | null;
  payer_bank_name?: string | null;
  status?: string | null;
  status_description?: string | null;
  return_url?: string | null;
  metadata?: Record<string, any> | null;
  payout?: Record<string, any> | null;
  payment_gateway?: Record<string, any> | null;
  portal?: string | null;
  merchant?: Record<string, any> | null;
  mandate?: Record<string, any> | null;
}

/**
 * FPX bank response data
 */
export interface FpxBankResponse {
  id: string;
  name: string;
  code: string;
  status: string;
}

/**
 * Portal response data
 */
export interface PortalResponse {
  id: string;
  portal_key: string;
  name: string;
  payment_channels: PaymentChannelInfo[];
}

/**
 * Payment channel info within portal
 */
export interface PaymentChannelInfo {
  id: number;
  name: string;
  code: string;
  enabled: boolean;
}

/**
 * FPX Direct Debit enrollment request
 */
export interface FpxDirectDebitEnrollmentRequest {
  order_number: string;
  amount: number;
  payer_name: string;
  payer_email: string;
  payer_telephone_number: string;
  payer_id_type: string;
  payer_id: string;
  application_reason: string;
  frequency_mode: string;
  callback_url?: string;
  return_url?: string;
  checksum?: string;
}

/**
 * FPX Direct Debit maintenance request
 */
export interface FpxDirectDebitMaintenanceRequest {
  amount: number;
  payer_email: string;
  payer_telephone_number: string;
  application_reason: string;
  frequency_mode: string;
  checksum?: string;
}

/**
 * FPX Direct Debit application response
 */
export interface FpxDirectDebitApplicationResponse {
  id: string;
  url: string;
  status: string;
  [key: string]: any;
}

/**
 * FPX Direct Debit response
 */
export interface FpxDirectDebitResponse {
  id: string;
  mandate_reference_number?: string;
  status: string;
  [key: string]: any;
}

/**
 * Transaction callback data
 */
export interface TransactionCallbackData {
  record_type: string;
  transaction_id: string;
  exchange_reference_number: string;
  exchange_transaction_id: string;
  order_number: string;
  currency: string;
  amount: string;
  payer_name: string;
  payer_email: string;
  payer_bank_name: string;
  status: string;
  status_description: string;
  datetime: string;
  checksum: string;
}

/**
 * Pre-transaction callback data
 */
export interface PreTransactionCallbackData {
  record_type: string;
  exchange_reference_number: string;
  order_number: string;
  checksum: string;
}

/**
 * Return URL callback data
 */
export interface ReturnUrlCallbackData {
  transaction_id: string;
  exchange_reference_number: string;
  exchange_transaction_id: string;
  order_number: string;
  currency: string;
  amount: string;
  payer_bank_name: string;
  status: string;
  status_description: string;
  checksum: string;
}

/**
 * Direct Debit bank approval callback data
 */
export interface DirectDebitBankApprovalCallbackData {
  record_type: string;
  approval_date: string;
  approval_status: string;
  mandate_id: string;
  mandate_reference_number: string;
  order_number: string;
  payer_bank_code_hashed: string;
  payer_bank_code: string;
  payer_bank_account_no: string;
  application_type: string;
  checksum: string;
}

/**
 * Direct Debit authorization callback data
 */
export interface DirectDebitAuthorizationCallbackData {
  record_type: string;
  transaction_id: string;
  mandate_id: string;
  exchange_reference_number: string;
  exchange_transaction_id: string;
  order_number: string;
  currency: string;
  amount: string;
  payer_name: string;
  payer_email: string;
  payer_bank_name: string;
  status: string;
  status_description: string;
  datetime: string;
  checksum: string;
}

/**
 * Direct Debit transaction callback data
 */
export interface DirectDebitTransactionCallbackData {
  record_type: string;
  batch_number: string;
  mandate_id: string;
  mandate_reference_number: string;
  transaction_id: string;
  datetime: string;
  reference_number: string;
  amount: string;
  status: string;
  status_description: string;
  cycle: string;
  checksum: string;
}

/**
 * Manual bank transfer request
 */
export interface ManualBankTransferRequest {
  portal_key: string;
  buyer_name: string;
  buyer_email: string;
  order_amount: number;
  order_no: string;
  payment_gateway: 2; // Must be 2 for manual transfers
  merchant_bank_name: string;
  merchant_bank_account: string;
  merchant_bank_account_holder: string;
  bank_transfer_type: string;
  bank_transfer_notes: string;
  bank_transfer_date?: string;
  proof_of_payment?: string | File | Blob;
}

/**
 * Transaction query parameters for v3 API
 */
export interface TransactionQueryParams {
  order_number?: string;
  status?: string;
  payment_channel?: PaymentChannel | number;
  exchange_reference_number?: string;
  payer_email?: string;
}

/**
 * Paginated response metadata
 */
export interface PaginationMeta {
  current_page?: number;
  from?: number;
  last_page?: number;
  per_page?: number;
  to?: number;
  total?: number;
  [key: string]: any;
}

/**
 * Paginated transaction response
 */
export interface PaginatedTransactionResponse {
  data: TransactionResponse[];
  meta: PaginationMeta;
}

/**
 * Bayarcash SDK configuration options
 */
export interface BayarcashConfig {
  sandbox?: boolean;
  apiVersion?: ApiVersion;
  timeout?: number;
}
