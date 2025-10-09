import { HttpClient } from './utils/HttpClient';
import { ChecksumGenerator } from './utils/ChecksumGenerator';
import { CallbackVerifications } from './utils/CallbackVerifications';
import { FpxDirectDebitActions } from './actions/FpxDirectDebitActions';
import { ManualBankTransferActions } from './actions/ManualBankTransferActions';
import {
  PaymentIntentResource,
  TransactionResource,
  FpxBankResource,
  PortalResource,
  FpxDirectDebitResource,
  FpxDirectDebitApplicationResource,
} from './resources';
import {
  ApiVersion,
  PaymentChannel,
  PaymentIntentRequest,
  TransactionQueryParams,
  PaginatedTransactionResponse,
  ManualBankTransferRequest,
  FpxDirectDebitEnrollmentRequest,
  FpxDirectDebitMaintenanceRequest,
  BayarcashConfig,
} from './types';

export class Bayarcash {
  // Payment channel constants
  public static readonly FPX = PaymentChannel.FPX;
  public static readonly MANUAL_TRANSFER = PaymentChannel.MANUAL_TRANSFER;
  public static readonly FPX_DIRECT_DEBIT = PaymentChannel.FPX_DIRECT_DEBIT;
  public static readonly FPX_LINE_OF_CREDIT = PaymentChannel.FPX_LINE_OF_CREDIT;
  public static readonly DUITNOW_DOBW = PaymentChannel.DUITNOW_DOBW;
  public static readonly DUITNOW_QR = PaymentChannel.DUITNOW_QR;
  public static readonly SPAYLATER = PaymentChannel.SPAYLATER;
  public static readonly BOOST_PAYFLEX = PaymentChannel.BOOST_PAYFLEX;
  public static readonly QRISOB = PaymentChannel.QRISOB;
  public static readonly QRISWALLET = PaymentChannel.QRISWALLET;
  public static readonly NETS = PaymentChannel.NETS;
  public static readonly CREDIT_CARD = PaymentChannel.CREDIT_CARD;
  public static readonly ALIPAY = PaymentChannel.ALIPAY;
  public static readonly WECHATPAY = PaymentChannel.WECHATPAY;
  public static readonly PROMPTPAY = PaymentChannel.PROMPTPAY;

  private token: string;
  private http: HttpClient;
  private sandbox: boolean = false;
  private apiVersion: ApiVersion = 'v2';
  private fpxDirectDebitActions: FpxDirectDebitActions;
  private manualBankTransferActions: ManualBankTransferActions;

  constructor(token: string, config?: BayarcashConfig) {
    this.token = token;

    // Apply configuration
    if (config) {
      if (config.sandbox !== undefined) {
        this.sandbox = config.sandbox;
      }
      if (config.apiVersion) {
        this.apiVersion = config.apiVersion;
      }
    }

    this.http = new HttpClient(this.getBaseUri(), token, config?.timeout);
    this.fpxDirectDebitActions = new FpxDirectDebitActions(this.http, this);
    this.manualBankTransferActions = new ManualBankTransferActions(token, this.sandbox);
  }

  /**
   * Switch to sandbox environment
   */
  public useSandbox(): this {
    this.sandbox = true;
    this.http.setBaseURL(this.getBaseUri(), this.token);
    this.manualBankTransferActions = new ManualBankTransferActions(this.token, this.sandbox);
    return this;
  }

  /**
   * Set API version
   */
  public setApiVersion(version: ApiVersion): this {
    this.apiVersion = version;
    this.http.setBaseURL(this.getBaseUri(), this.token);
    return this;
  }

  /**
   * Get current API version
   */
  public getApiVersion(): ApiVersion {
    return this.apiVersion;
  }

  /**
   * Set request timeout
   */
  public setTimeout(timeout: number): this {
    this.http.setTimeout(timeout);
    return this;
  }

  /**
   * Get current timeout
   */
  public getTimeout(): number {
    return this.http.getTimeout();
  }

  /**
   * Get base URI based on API version and environment
   */
  private getBaseUri(): string {
    if (this.apiVersion === 'v3') {
      return this.sandbox
        ? 'https://api.console.bayarcash-sandbox.com/v3/'
        : 'https://api.console.bayar.cash/v3/';
    }

    return this.sandbox
      ? 'https://console.bayarcash-sandbox.com/api/v2/'
      : 'https://console.bayar.cash/api/v2/';
  }

  /**
   * Transform collection to resource instances
   */
  private transformCollection<T>(
    collection: any[],
    resourceClass: new (data: any, bayarcash: Bayarcash) => T
  ): T[] {
    return collection.map((data) => new resourceClass(data, this));
  }

  // ===================
  // CHECKSUM METHODS
  // ===================

  /**
   * Create payment intent checksum (with typo for backward compatibility)
   */
  public createPaymentIntenChecksumValue(secretKey: string, data: PaymentIntentRequest): string {
    return ChecksumGenerator.createPaymentIntenChecksumValue(secretKey, data);
  }

  /**
   * Create payment intent checksum
   */
  public createPaymentIntentChecksumValue(secretKey: string, data: PaymentIntentRequest): string {
    return ChecksumGenerator.createPaymentIntentChecksumValue(secretKey, data);
  }

  /**
   * Create FPX Direct Debit enrollment checksum
   */
  public createFpxDirectDebitEnrolmentChecksumValue(
    secretKey: string,
    data: FpxDirectDebitEnrollmentRequest
  ): string {
    return ChecksumGenerator.createFpxDirectDebitEnrolmentChecksumValue(secretKey, data);
  }

  /**
   * Create FPX Direct Debit maintenance checksum
   */
  public createFpxDirectDebitMaintenanceChecksumValue(
    secretKey: string,
    data: FpxDirectDebitMaintenanceRequest
  ): string {
    return ChecksumGenerator.createFpxDirectDebitMaintenanceChecksumValue(secretKey, data);
  }

  // ===================
  // CALLBACK VERIFICATION METHODS
  // ===================

  public verifyTransactionCallbackData = CallbackVerifications.verifyTransactionCallbackData;
  public verifyPreTransactionCallbackData = CallbackVerifications.verifyPreTransactionCallbackData;
  public verifyReturnUrlCallbackData = CallbackVerifications.verifyReturnUrlCallbackData;
  public verifyDirectDebitBankApprovalCallbackData =
    CallbackVerifications.verifyDirectDebitBankApprovalCallbackData;
  public verifyDirectDebitAuthorizationCallbackData =
    CallbackVerifications.verifyDirectDebitAuthorizationCallbackData;
  public verifyDirectDebitTransactionCallbackData =
    CallbackVerifications.verifyDirectDebitTransactionCallbackData;

  // ===================
  // FPX BANK METHODS
  // ===================

  /**
   * Get list of FPX banks
   */
  public async fpxBanksList(): Promise<FpxBankResource[]> {
    const data = await this.http.get<any[]>('banks');
    return this.transformCollection(data, FpxBankResource);
  }

  // ===================
  // PORTAL METHODS
  // ===================

  /**
   * Get list of portals
   */
  public async getPortals(): Promise<PortalResource[]> {
    const response = await this.http.get<any>('portals');
    const data = response.data || response;
    return this.transformCollection(data, PortalResource);
  }

  /**
   * Get available payment channels for a specific portal
   */
  public async getChannels(portalKey: string): Promise<any[]> {
    const portals = await this.getPortals();
    const portal = portals.find((p) => p.portalKey === portalKey);
    return portal ? portal.paymentChannels : [];
  }

  // ===================
  // PAYMENT INTENT METHODS
  // ===================

  /**
   * Create a new payment intent
   */
  public async createPaymentIntent(data: PaymentIntentRequest): Promise<PaymentIntentResource> {
    const response = await this.http.post('payment-intents', data);
    return new PaymentIntentResource(response, this);
  }

  /**
   * Get payment intent by ID (v3 only)
   */
  public async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntentResource> {
    if (this.apiVersion !== 'v3') {
      throw new Error('The getPaymentIntent method is only available for API version v3.');
    }

    const response = await this.http.get(`payment-intents/${paymentIntentId}`);
    return new PaymentIntentResource(response, this);
  }

  // ===================
  // TRANSACTION METHODS
  // ===================

  /**
   * Get transaction by ID
   */
  public async getTransaction(id: string): Promise<TransactionResource> {
    const response = await this.http.get(`transactions/${id}`);
    return new TransactionResource(response, this);
  }

  /**
   * Get all transactions with optional filters (v3 only)
   */
  public async getAllTransactions(
    parameters: TransactionQueryParams = {}
  ): Promise<PaginatedTransactionResponse> {
    if (this.apiVersion !== 'v3') {
      throw new Error('The getAllTransactions method is only available for API version v3.');
    }

    const allowedParameters: (keyof TransactionQueryParams)[] = [
      'order_number',
      'status',
      'payment_channel',
      'exchange_reference_number',
      'payer_email',
    ];

    // Filter allowed parameters
    const queryParams: Record<string, any> = {};
    Object.keys(parameters).forEach((key) => {
      if (allowedParameters.includes(key as keyof TransactionQueryParams)) {
        queryParams[key] = parameters[key as keyof TransactionQueryParams];
      }
    });

    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = queryString ? `transactions?${queryString}` : 'transactions';

    const response = await this.http.get<any>(endpoint);

    return {
      data: this.transformCollection(response.data || [], TransactionResource),
      meta: response.meta || {},
    };
  }

  /**
   * Get transaction by order number (v3 only)
   */
  public async getTransactionByOrderNumber(orderNumber: string): Promise<TransactionResource[]> {
    if (this.apiVersion !== 'v3') {
      throw new Error('The getTransactionByOrderNumber method is only available for API version v3.');
    }

    const response = await this.http.get<any>(`transactions?order_number=${orderNumber}`);
    return this.transformCollection(response.data || [], TransactionResource);
  }

  /**
   * Get transactions by payer email (v3 only)
   */
  public async getTransactionsByPayerEmail(email: string): Promise<TransactionResource[]> {
    if (this.apiVersion !== 'v3') {
      throw new Error('The getTransactionsByPayerEmail method is only available for API version v3.');
    }

    const response = await this.http.get<any>(`transactions?payer_email=${encodeURIComponent(email)}`);
    return this.transformCollection(response.data || [], TransactionResource);
  }

  /**
   * Get transactions by status (v3 only)
   */
  public async getTransactionsByStatus(status: string): Promise<TransactionResource[]> {
    if (this.apiVersion !== 'v3') {
      throw new Error('The getTransactionsByStatus method is only available for API version v3.');
    }

    const response = await this.http.get<any>(`transactions?status=${status}`);
    return this.transformCollection(response.data || [], TransactionResource);
  }

  /**
   * Get transactions by payment channel (v3 only)
   */
  public async getTransactionsByPaymentChannel(channel: number): Promise<TransactionResource[]> {
    if (this.apiVersion !== 'v3') {
      throw new Error('The getTransactionsByPaymentChannel method is only available for API version v3.');
    }

    const response = await this.http.get<any>(`transactions?payment_channel=${channel}`);
    return this.transformCollection(response.data || [], TransactionResource);
  }

  /**
   * Get transaction by exchange reference number (v3 only)
   */
  public async getTransactionByReferenceNumber(
    referenceNumber: string
  ): Promise<TransactionResource | null> {
    if (this.apiVersion !== 'v3') {
      throw new Error('The getTransactionByReferenceNumber method is only available for API version v3.');
    }

    const response = await this.http.get<any>(
      `transactions?exchange_reference_number=${encodeURIComponent(referenceNumber)}`
    );
    const data = response.data || [];
    if (data.length === 0) {
      return null;
    }
    return this.transformCollection(data, TransactionResource)[0] || null;
  }

  // ===================
  // FPX DIRECT DEBIT METHODS
  // ===================

  public async createFpxDirectDebitEnrollment(
    data: Record<string, any>
  ): Promise<FpxDirectDebitApplicationResource> {
    return this.fpxDirectDebitActions.createFpxDirectDebitEnrollment(data);
  }

  public async createFpxDirectDebitMaintenance(
    mandateId: string,
    data: Record<string, any>
  ): Promise<FpxDirectDebitApplicationResource> {
    return this.fpxDirectDebitActions.createFpxDirectDebitMaintenance(mandateId, data);
  }

  public async createFpxDirectDebitTermination(
    mandateId: string,
    data: Record<string, any>
  ): Promise<FpxDirectDebitApplicationResource> {
    return this.fpxDirectDebitActions.createFpxDirectDebitTermination(mandateId, data);
  }

  public async getfpxDirectDebitransaction(id: string): Promise<TransactionResource> {
    return this.fpxDirectDebitActions.getfpxDirectDebitransaction(id);
  }

  public async getFpxDirectDebit(id: string): Promise<FpxDirectDebitResource> {
    return this.fpxDirectDebitActions.getFpxDirectDebit(id);
  }

  // ===================
  // MANUAL BANK TRANSFER METHODS
  // ===================

  public async createManualBankTransfer(
    data: ManualBankTransferRequest,
    allowRedirect: boolean = false
  ): Promise<any> {
    return this.manualBankTransferActions.createManualBankTransfer(data, allowRedirect);
  }

  public async updateManualBankTransferStatus(
    refNo: string,
    status: string,
    amount: string
  ): Promise<any> {
    return this.manualBankTransferActions.updateManualBankTransferStatus(refNo, status, amount);
  }

  public parseManualBankTransferResponse(htmlResponse: string): Record<string, string | null> {
    return this.manualBankTransferActions.parseManualBankTransferResponse(htmlResponse);
  }
}
