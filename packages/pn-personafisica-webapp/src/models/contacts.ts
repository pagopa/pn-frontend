export enum LegalChannelType {
  PEC = 'PEC',
  IOPEC = 'IOPEC',
}

export enum CourtesyChannelType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IOMSG = 'IOMSG',
}

export interface DigitalAddress {
  addressType: string;
  recipientId: string;
  senderId: string;
  channelType: LegalChannelType | CourtesyChannelType;
  value: string;
  code: string;
}

export interface DigitalAddresses {
  legal: Array<DigitalAddress>;
  courtesy: Array<DigitalAddress>;
}

export interface SaveDigitalAddressParams {
  recipientId: string;
  senderId: string;
  channelType: LegalChannelType | CourtesyChannelType;
  value: string;
  code?: string;
}
