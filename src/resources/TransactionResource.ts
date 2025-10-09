import { Resource } from './Resource';

export class TransactionResource extends Resource {
  public id?: string | null;
  public updatedAt?: string | null;
  public createdAt?: string | null;
  public datetime?: string | null;
  public payerName?: string | null;
  public payerEmail?: string | null;
  public payerTelephoneNumber?: string | null;
  public orderNumber?: string | null;
  public currency?: string | null;
  public amount?: number | null;
  public exchangeReferenceNumber?: string | null;
  public exchangeTransactionId?: string | null;
  public payerBankName?: string | null;
  public status?: string | null;
  public statusDescription?: string | null;
  public returnUrl?: string | null;
  public metadata?: Record<string, any> | null;
  public payout?: Record<string, any> | null;
  public paymentGateway?: Record<string, any> | null;
  public portal?: string | null;
  public merchant?: Record<string, any> | null;
  public mandate?: Record<string, any> | null;
}
