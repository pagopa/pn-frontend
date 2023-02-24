import { SenderParty } from '../redux/contact/types';

export enum LegalChannelType {
  PEC = 'PEC',
}

export enum CourtesyChannelType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IOMSG = 'APPIO',
}

export enum IOAllowedValues {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export interface DigitalAddress {
  addressType: string;
  recipientId: string;
  senderId: Array<SenderParty> | string;
  channelType: LegalChannelType | CourtesyChannelType;
  value: string;
  code: string;
}

export interface DigitalAddresses {
  legal: Array<DigitalAddress>;
  courtesy: Array<DigitalAddress>;
}
