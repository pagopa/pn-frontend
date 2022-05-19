import {
  CourtesyChannelType,
  DigitalAddress,
  DigitalAddresses,
  LegalChannelType,
} from '../../models/contacts';
import { apiClient } from '../axios';

export const ContactsApi = {
  /**
   * Gets current user digital addresses
   * @param  {string} recipientId
   * @returns Promise
   */
  getDigitalAddresses: (): Promise<DigitalAddresses> =>
    apiClient.get<DigitalAddresses>(`/address-book/v1/digital-address`).then((response) => ({
      legal: response.data.legal ? response.data.legal : [],
      courtesy: response.data.courtesy ? response.data.courtesy : [],
    })),

  /**
   * Create or update a digital address with legal value
   * @param  {string} recipientId
   * @returns Promise
   */
  createOrUpdateLegalAddress: (
    recipientId: string,
    senderId: string,
    channelType: LegalChannelType,
    body: { value: string; verificationCode?: string }
  ): Promise<void | DigitalAddress> =>
    apiClient
      .post<void>(`/address-book/v1/digital-address/legal/${senderId}/${channelType}`, body)
      .then((response) => {
        if (response.status !== 204) {
          // user must verify email
          return;
        }
        // email already verified
        return {
          addressType: 'legal',
          recipientId,
          senderId,
          channelType,
          value: body.value,
          code: 'verified',
        };
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
    body: { value: string; verificationCode?: string }
  ): Promise<void | DigitalAddress> =>
    apiClient
      .post<void>(`/address-book/v1/digital-address/courtesy/${senderId}/${channelType}`, body)
      .then((response) => {
        if (response.status !== 204) {
          // user must verify email
          return;
        }
        // email already verified
        return {
          addressType: 'courtesy',
          recipientId,
          senderId,
          channelType,
          value: body.value,
          code: 'verified',
        };
      }),
  /*
   * Remove current user digital address
   * @param  {string} recipientId
   * @returns Promise
   */
  deleteLegalAddress: (senderId: string, channelType: LegalChannelType): Promise<string> =>
    apiClient
      .delete<string>(`/address-book/v1/digital-address/legal/${senderId}/${channelType}`)
      .then(() => senderId),
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
      .delete<string>(
        `/address-book/v1/digital-address/courtesy/${courtesySenderId}/${channelType}`
      )
      .then(() => courtesySenderId),
};
