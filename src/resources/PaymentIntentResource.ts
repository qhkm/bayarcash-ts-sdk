import { Resource } from './Resource';

export class PaymentIntentResource extends Resource {
  public payerName!: string;
  public payerEmail!: string;
  public payerTelephoneNumber?: string | null;
  public orderNumber!: string;
  public amount!: number;
  public url!: string;
  public type!: string;
  public id!: string;
  public status!: string;
  public lastAttempt?: any;
  public paidAt?: string | null;
  public currency!: string;
  public attempts!: any[];
}
