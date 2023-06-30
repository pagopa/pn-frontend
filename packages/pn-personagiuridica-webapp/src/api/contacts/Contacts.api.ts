import {
  CourtesyChannelType,
  DigitalAddress,
  DigitalAddresses,
  LegalChannelType,
} from '../../models/contacts';
import { apiClient } from '../apiClients';
import { CONTACTS_LIST, COURTESY_CONTACT, LEGAL_CONTACT } from './contacts.routes';

export const ContactsApi = {
  /**
   * Gets current user digital addresses
   * @param  {string} recipientId
   * @returns Promise
   */
  getDigitalAddresses: (): Promise<DigitalAddresses> =>
    apiClient.get<DigitalAddresses>(CONTACTS_LIST()).then((response) => ({
      legal: response.data.legal
        ? response.data.legal.filter((address) => address.codeValid !== false)
        : [],
      courtesy: response.data.courtesy ? response.data.courtesy : [],
    })),

  /**
   * Create or update a digital address with legal value
   * @param  {string} recipientId
   * @param  {string} senderId
   * @param  {LegalChannelType} channelType
   * @param  {object} body
   * @param  {string} senderName
   * @returns Promise
   */
  createOrUpdateLegalAddress: (
    recipientId: string,
    senderId: string,
    channelType: LegalChannelType,
    body: { value: string; verificationCode?: string },
    senderName?: string
  ): Promise<void | DigitalAddress> =>
    apiClient
      .post<void | { result: string }>(LEGAL_CONTACT(senderId, channelType), body)
      .then((response) => {
        if (response.status === 204) {
          // email already verified
          return {
            addressType: 'legal',
            recipientId,
            senderId,
            senderName,
            channelType,
            value: body.value,
            pecValid: true,
          };
        }

        // PEC_VALIDATION_REQUIRED is received when the code has been inserted and is valid, but the pec validation is
        // still in progress
        if (response.data?.result === 'PEC_VALIDATION_REQUIRED') {
          return {
            addressType: 'legal',
            recipientId,
            senderId,
            senderName,
            channelType,
            value: '',
            pecValid: false,
          };
        } else {
          return;
        }
      }),
  /**
   * Create or update a courtesy address
   * @param  {string} recipientId
   * @returns Promise
   */
  createOrUpdateCourtesyAddress: (
    recipientId: string,
    senderId: string,
    channelType: CourtesyChannelType,
    body: { value: string; verificationCode?: string },
    senderName?: string
  ): Promise<void | DigitalAddress> =>
    apiClient.post<void>(COURTESY_CONTACT(senderId, channelType), body).then((response) => {
      if (response.status !== 204) {
        // user must verify email
        return;
      }
      // email already verified
      return {
        addressType: 'courtesy',
        recipientId,
        senderId,
        senderName,
        channelType,
        value: body.value,
      };
    }),
  /*
   * Remove current user digital address
   * @param  {string} recipientId
   * @returns Promise
   */
  deleteLegalAddress: (senderId: string, channelType: LegalChannelType): Promise<string> =>
    apiClient.delete<string>(LEGAL_CONTACT(senderId, channelType)).then(() => senderId),
  /*
   * Remove current user digital address
   * @param  {string} recipientId
   * @returns Promise
   */
  deleteCourtesyAddress: (
    courtesySenderId: string,
    channelType: CourtesyChannelType
  ): Promise<string> =>
    apiClient
      .delete<string>(COURTESY_CONTACT(courtesySenderId, channelType))
      .then(() => courtesySenderId),
};
