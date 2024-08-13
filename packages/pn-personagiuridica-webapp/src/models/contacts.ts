export enum ChannelType {
  PEC = 'PEC',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  SERCQ = 'SERCQ',
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

export interface DeleteDigitalAddressParams {
  addressType: AddressType;
  senderId: string;
  channelType: ChannelType;
}

export interface SaveDigitalAddressParams {
  addressType: AddressType;
  senderId: string;
  senderName?: string;
  channelType: ChannelType;
  value: string;
  code?: string;
}
