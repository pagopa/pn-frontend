import _ from 'lodash';
import { DigitalAddress, DigitalAddresses, LegalChannelType } from '../../models/contacts';
import { apiClient } from '../axios';

const mockedContacts = [
  {
    value: 'mario.rossi@toverify.it',
    code: '12345',
    isVerified: false,
  },
  {
    value: 'mario.rossi@verified.it',
    code: '12345',
    isVerified: true,
  },
];

export const ContactsApi = {
  /**
   * Gets current user digital addresses
   * @param  {string} recipientId
   * @returns Promise
   */
  getDigitalAddresses: (recipientId: string): Promise<DigitalAddresses> =>
    apiClient
      .get<DigitalAddresses>(`/address-book/v1/digital-address/${recipientId}`)
      .then((response) => response.data),

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
    new Promise((resolve, reject) => {
      /* eslint-disable functional/immutable-data */
      const mockedContact = mockedContacts.find((m) => m.value === body.value);
      if (!mockedContact) {
        return reject('No mocked contact found');
      }
      // simulate 200
      if (!mockedContact?.isVerified && !body.verificationCode) {
        return resolve();
      }
      // check code - simulate 406
      if (mockedContact.code !== body.verificationCode) {
        return reject({response: {status: 406}, blockNotification: true});
      }
      return resolve({
        addressType: 'legal',
        recipientId,
        senderId,
        channelType,
        value: body.value,
        code: body.verificationCode || mockedContact.code,
      });
      /* eslint-enable functional/immutable-data */
    }),
  /* 
  apiClient
      .post<void>(
        `/address-book/v1/digital-address/${recipientId}/legal/${senderId}/${channelType}`,
        body
      )
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
          code: body.verificationCode as string,
        };
      }),
  */
};
