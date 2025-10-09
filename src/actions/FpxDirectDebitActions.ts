import { HttpClient } from '../utils/HttpClient';
import {
  FpxDirectDebitApplicationResource,
  FpxDirectDebitResource,
  TransactionResource,
} from '../resources';
import { Bayarcash } from '../Bayarcash';

export class FpxDirectDebitActions {
  constructor(private http: HttpClient, private bayarcash: Bayarcash) {}

  /**
   * Create FPX Direct Debit enrollment
   */
  public async createFpxDirectDebitEnrollment(
    data: Record<string, any>
  ): Promise<FpxDirectDebitApplicationResource> {
    const response = await this.http.post('mandates', data);
    return new FpxDirectDebitApplicationResource(response, this.bayarcash);
  }

  /**
   * Create FPX Direct Debit maintenance
   */
  public async createFpxDirectDebitMaintenance(
    mandateId: string,
    data: Record<string, any>
  ): Promise<FpxDirectDebitApplicationResource> {
    const response = await this.http.put(`mandates/${mandateId}`, data);
    return new FpxDirectDebitApplicationResource(response, this.bayarcash);
  }

  /**
   * Create FPX Direct Debit termination
   */
  public async createFpxDirectDebitTermination(
    mandateId: string,
    data: Record<string, any>
  ): Promise<FpxDirectDebitApplicationResource> {
    const response = await this.http.delete(`mandates/${mandateId}`, data);
    return new FpxDirectDebitApplicationResource(response, this.bayarcash);
  }

  /**
   * Get FPX Direct Debit transaction (note: maintains typo from PHP for compatibility)
   */
  public async getfpxDirectDebitransaction(id: string): Promise<TransactionResource> {
    const response = await this.http.get(`mandates/transactions/${id}`);
    return new TransactionResource(response, this.bayarcash);
  }

  /**
   * Get FPX Direct Debit details
   */
  public async getFpxDirectDebit(id: string): Promise<FpxDirectDebitResource> {
    const response = await this.http.get(`mandates/${id}`);
    return new FpxDirectDebitResource(response, this.bayarcash);
  }
}
