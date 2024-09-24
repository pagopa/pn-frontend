export enum ChannelType {
  PEC = 'PEC',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IOMSG = 'APPIO',
  SERCQ_SEND = 'SERCQ_SEND',
}

export enum IOAllowedValues {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export enum AddressType {
  LEGAL = 'LEGAL',
  COURTESY = 'COURTESY',
}

export enum ContactSource {
  RECAPITI = 'recapiti',
  PROFILO = 'profilo',
  HOME_NOTIFICHE = 'home_notifiche',
  DETTAGLIO_NOTIFICA = 'dettaglio_notifica',
}

export enum ContactOperation {
  ADD = 'ADD',
  SCROLL = 'SCROLL',
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

export interface ExternalEvent {
  source: ContactSource;
  destination: ChannelType;
  operation: ContactOperation;
}
