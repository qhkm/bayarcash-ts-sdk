import { Resource } from './Resource';
import { PaymentChannelInfo } from '../types';

export class PortalResource extends Resource {
  public id!: string;
  public portalKey!: string;
  public name!: string;
  public paymentChannels!: PaymentChannelInfo[];
}
