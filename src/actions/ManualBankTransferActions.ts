import axios from 'axios';
import { ManualBankTransferRequest } from '../types';

export class ManualBankTransferActions {
  constructor(
    private token: string,
    private sandbox: boolean
  ) {}

  /**
   * Create manual bank transfer
   */
  public async createManualBankTransfer(
    data: ManualBankTransferRequest,
    allowRedirect: boolean = false
  ): Promise<any> {
    this.validateManualTransferData(data);

    // Set default bank transfer date if not provided
    if (!data.bank_transfer_date) {
      data.bank_transfer_date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    }

    const formData = await this.prepareManualTransferFormData(data);
    const response = await this.executeManualTransferRequest(formData, allowRedirect);

    return this.processManualTransferResponse(
      response.body,
      response.httpCode,
      allowRedirect
    );
  }

  /**
   * Update manual bank transfer status
   */
  public async updateManualBankTransferStatus(
    refNo: string,
    status: string,
    amount: string
  ): Promise<any> {
    const data = {
      ref_no: refNo,
      status,
      amount,
    };

    const params = new URLSearchParams(data);

    try {
      const response = await axios.post(
        `${this.getManualTransferBaseUrl()}/manual-bank-transfer/update-status`,
        params,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 30000,
        }
      );

      return this.handleApiResponse(response.data, response.status);
    } catch (error: any) {
      if (error.response) {
        return this.handleApiResponse(error.response.data, error.response.status);
      }
      throw new Error(`Connection failed: ${error.message}`);
    }
  }

  /**
   * Parse manual bank transfer HTML response
   */
  public parseManualBankTransferResponse(htmlResponse: string): Record<string, string | null> {
    const data: Record<string, string | null> = {};

    // Extract form ID
    const formIdMatch = htmlResponse.match(/id="([^"]+)"/);
    if (formIdMatch) {
      data.form_id = formIdMatch[1];
    }

    // Extract action URL
    const actionMatch = htmlResponse.match(/action="([^"]+)"/);
    if (actionMatch) {
      data.return_url = actionMatch[1];
    }

    // Extract hidden input fields
    const inputRegex = /<input name="([^"]+)" type="hidden" value="([^"]*)"\/?>/g;
    let match;
    while ((match = inputRegex.exec(htmlResponse)) !== null) {
      data[match[1]] = match[2];
    }

    return data;
  }

  /**
   * Get the base URL based on environment
   */
  private getManualTransferBaseUrl(): string {
    return this.sandbox
      ? 'https://console.bayarcash-sandbox.com/api'
      : 'https://console.bayar.cash/api';
  }

  /**
   * Validate manual transfer data
   */
  private validateManualTransferData(data: ManualBankTransferRequest): void {
    const requiredFields: (keyof ManualBankTransferRequest)[] = [
      'portal_key',
      'buyer_name',
      'buyer_email',
      'order_amount',
      'order_no',
      'payment_gateway',
      'merchant_bank_name',
      'merchant_bank_account',
      'merchant_bank_account_holder',
      'bank_transfer_type',
      'bank_transfer_notes',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Required field '${field}' is missing`);
      }
    }

    if (data.payment_gateway !== 2) {
      throw new Error('Invalid payment gateway. Value must be 2 for manual bank transfers.');
    }
  }

  /**
   * Prepare FormData for manual transfer request
   */
  private async prepareManualTransferFormData(
    data: ManualBankTransferRequest
  ): Promise<FormData> {
    const formData = new FormData();

    // Add all fields except proof_of_payment
    Object.keys(data).forEach((key) => {
      if (key !== 'proof_of_payment' && data[key as keyof ManualBankTransferRequest]) {
        formData.append(key, String(data[key as keyof ManualBankTransferRequest]));
      }
    });

    // Handle proof_of_payment file
    if (data.proof_of_payment) {
      if (data.proof_of_payment instanceof File || data.proof_of_payment instanceof Blob) {
        formData.append('proof_of_payment', data.proof_of_payment);
      } else if (typeof data.proof_of_payment === 'string') {
        // In Node.js, this would be a file path - handle accordingly
        // For browser, this might be a base64 string or URL
        throw new Error(
          'File path string not supported in browser. Please provide File or Blob object.'
        );
      }
    }

    return formData;
  }

  /**
   * Execute manual transfer request
   */
  private async executeManualTransferRequest(
    formData: FormData,
    allowRedirect: boolean
  ): Promise<{ body: string; httpCode: number }> {
    try {
      const response = await axios.post(
        `${this.getManualTransferBaseUrl()}/manual-bank-transfer`,
        formData,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          timeout: 30000,
          maxRedirects: allowRedirect ? 10 : 0,
          validateStatus: () => true, // Don't throw on any status
        }
      );

      return {
        body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
        httpCode: response.status,
      };
    } catch (error: any) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  /**
   * Process manual transfer response
   */
  private processManualTransferResponse(
    response: string,
    httpCode: number,
    allowRedirect: boolean
  ): any {
    if (httpCode >= 200 && httpCode < 300) {
      if (response.includes('<form')) {
        const parsedData = this.parseManualBankTransferResponse(response);

        return {
          success: true,
          html_form: response,
          form_data: parsedData,
          return_url: parsedData.return_url || null,
        };
      } else {
        try {
          return JSON.parse(response);
        } catch {
          return response;
        }
      }
    } else if (httpCode >= 300 && httpCode < 400 && !allowRedirect) {
      return { redirect_url: response };
    } else {
      return this.handleApiError(response, httpCode);
    }
  }

  /**
   * Handle API error
   */
  private handleApiError(response: string, httpCode: number): never {
    try {
      const decoded = JSON.parse(response);
      if (decoded.message) {
        throw new Error(decoded.message);
      }
    } catch {
      // Not JSON or no message field
    }
    throw new Error(`API Error (HTTP ${httpCode}): ${response.substring(0, 200)}`);
  }

  /**
   * Handle API response
   */
  private handleApiResponse(response: any, httpCode: number): any {
    if (httpCode >= 200 && httpCode < 300) {
      return typeof response === 'string' ? JSON.parse(response) : response;
    } else {
      const responseStr = typeof response === 'string' ? response : JSON.stringify(response);
      return this.handleApiError(responseStr, httpCode);
    }
  }
}
