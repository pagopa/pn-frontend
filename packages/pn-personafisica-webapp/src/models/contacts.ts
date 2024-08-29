export enum ChannelType {
  PEC = 'PEC',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IOMSG = 'APPIO',
  SERCQ = 'SERCQ',
}

export enum IOAllowedValues {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export const SERCQ_SEND_VALUE = 'x-pagopa-pn-sercq:send-self:notification-already-delivered';

export enum AddressType {
  LEGAL = 'LEGAL',
  COURTESY = 'COURTESY',
}

export interface Sender {
  senderId: string;
  senderName?: string;
}

export interface DigitalAddress extends Sender {
  addressType: AddressType;
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

export interface SaveDigitalAddressParams extends Sender {
  addressType: AddressType;
  channelType: ChannelType;
  value: string;
  code?: string;
}
