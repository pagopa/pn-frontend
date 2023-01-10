import {
  CourtesyChannelType,
  DigitalAddress,
  DigitalAddresses,
  LegalChannelType,
} from '../../models/contacts';
/* import { deleteCourtesyAddress } from '../../redux/contact/actions';
import {  COURTESY_CONTACT, LEGAL_CONTACT } from './contacts.routes';
 */
export const ContactsApi = {
  /**
   * Gets current user digital addresses
   * @param  {string} recipientId
   * @returns Promise
   */

  /* getDigitalAddresses: (): Promise<DigitalAddresses> => 
    apiClient.get<DigitalAddresses>(CONTACTS_LIST()).then((response) => ({
        legal: response.data.legal ? response.data.legal : [],
        courtesy: response.data.courtesy ? response.data.courtesy : [],
      })
    ), */

  getDigitalAddresses: (): Promise<DigitalAddresses> =>
    Promise.resolve({
      legal: [
        {
          addressType: 'LEGAL',
          recipientId: 'PF-b32e4920-6ff3-4872-8018-d60a4e5827f9',
          senderId: 'default',
          channelType: LegalChannelType.PEC,
          value: 'test@prova.org',
          code: '',
        },
      ],
      courtesy: [
        {
          addressType: 'COURTESY',
          recipientId: 'PF-b32e4920-6ff3-4872-8018-d60a4e5827f9',
          senderId: 'default',
          channelType: CourtesyChannelType.SMS,
          value: '+3912345678912',
          code: '',
        },
      ],
    }),

  /*  /**
   * Create or update a digital address with legal value
   * @param  {string} recipientId
   * @returns Promise
   
  createOrUpdateLegalAddress: (
    recipientId: string,
    senderId: string,
    channelType: LegalChannelType,
    body: { value: string; verificationCode?: string }
  ): Promise<void | DigitalAddress> =>
    apiClient.post<void>(LEGAL_CONTACT(senderId, channelType), body).then((response) => {
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
    }), */

  createOrUpdateLegalAddress: (
    recipientId: string,
    senderId: string,
    channelType: LegalChannelType,
    body: { value: string; verificationCode?: string }
  ): Promise<void | DigitalAddress> => {
    console.log({ recipientId, senderId, body, channelType });
    return Promise.resolve();
  },

  /*
  /**
   * Create or update a courtesy address
   * @param  {string} recipientId
   * @returns Promise
   
   createOrUpdateCourtesyAddress: (
    recipientId: string,
    senderId: string,
    channelType: CourtesyChannelType,
    body: { value: string; verificationCode?: string }
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
        channelType,
        value: body.value,
        code: 'verified',
      };
    }), */
  createOrUpdateCourtesyAddress: (
    recipientId: string,
    senderId: string,
    channelType: CourtesyChannelType,
    body: { value: string; verificationCode?: string }
  ): Promise<void | DigitalAddress> => {
    console.log({ recipientId, senderId, body, channelType });
    return Promise.resolve();
  },

  /* /*
   * Remove current user digital address
   * @param  {string} recipientId
   * @returns Promise
   
  deleteLegalAddress: (senderId: string, channelType: LegalChannelType): Promise<string> =>
    apiClient.delete<string>(LEGAL_CONTACT(senderId, channelType)).then(() => senderId),
     */
  deleteLegalAddress: (senderId: string, channelType: LegalChannelType): Promise<string> => {
    console.log({ senderId, channelType });
    return Promise.resolve('');
  },

  /*
   * Remove current user digital address
   * @param  {string} recipientId
   * @returns Promise
   
  deleteCourtesyAddress: (
    courtesySenderId: string,
    channelType: CourtesyChannelType
  ): Promise<string> =>
    apiClient
      .delete<string>(COURTESY_CONTACT(courtesySenderId, channelType))
      .then(() => courtesySenderId),
*/
  deleteCourtesyAddress: (
    courtesySenderId: string,
    channelType: CourtesyChannelType
  ): Promise<string> => {
    console.log({ courtesySenderId, channelType });
    return Promise.resolve('');
  },
};
