import { AddressType, ChannelType } from '../../models/contacts';

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
