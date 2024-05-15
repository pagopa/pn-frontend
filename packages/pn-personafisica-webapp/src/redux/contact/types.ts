import { AddressType, CourtesyChannelType, LegalChannelType } from '../../models/contacts';

export interface DeleteDigitalAddressParams {
  addressType: AddressType;
  senderId: string;
  channelType: LegalChannelType | CourtesyChannelType;
}

export interface SaveDigitalAddressParams {
  addressType: AddressType;
  recipientId: string;
  senderId: string;
  senderName?: string;
  channelType: LegalChannelType | CourtesyChannelType;
  value: string;
  code?: string;
}

export interface SenderParty {
  uniqueIdentifier: string;
}
