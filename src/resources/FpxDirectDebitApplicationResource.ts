import { Resource } from './Resource';

export class FpxDirectDebitApplicationResource extends Resource {
  public id!: string;
  public url!: string;
  public status!: string;
  [key: string]: any; // Allow additional dynamic properties
}
