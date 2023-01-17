import { LegalChannelType, CourtesyChannelType } from "../../models/contacts";

export interface DeleteDigitalAddressParams {
    recipientId: string;
    senderId: string;
    channelType: LegalChannelType | CourtesyChannelType;
  }
  
  export interface SaveDigitalAddressParams {
    recipientId: string;
    senderId: string;
    channelType: LegalChannelType | CourtesyChannelType;
    value: string;
    code?: string;
  }
  