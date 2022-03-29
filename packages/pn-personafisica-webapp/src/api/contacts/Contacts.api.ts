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
      if (!mockedContact?.isVerified) {
        mockedContact.isVerified = true;
        return resolve();
      }
      // check code
      if (mockedContact.code !== body.verificationCode && mockedContact.value === 'mario.rossi@toverify.it') {
        return reject('Wrong code');
      }
      if (mockedContact.value === 'mario.rossi@toverify.it') {
        // reset contact
        mockedContact.isVerified = false;
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
