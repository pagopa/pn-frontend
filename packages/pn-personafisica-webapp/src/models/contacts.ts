export enum ChannelType {
  PEC = 'PEC',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IOMSG = 'APPIO',
}

export enum IOAllowedValues {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export enum AddressType {
  LEGAL = 'LEGAL',
  COURTESY = 'COURTESY',
}

export interface DigitalAddress {
  addressType: AddressType;
  senderId: string;
  senderName?: string;
  channelType: ChannelType;
  value: string;
  pecValid?: boolean;
  codeValid?: boolean;
}
