export enum ChannelType {
  PEC = 'PEC',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
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
