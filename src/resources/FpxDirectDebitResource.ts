import { Resource } from './Resource';

export class FpxDirectDebitResource extends Resource {
  public id!: string;
  public mandateReferenceNumber?: string;
  public status!: string;
  [key: string]: any; // Allow additional dynamic properties
}
