import _ from 'lodash';
import { DigitalAddress, DigitalAddresses, LegalChannelType } from '../../models/contacts';
import { apiClient } from '../axios';

const mockedContacts: Array<{ value: string; code: string; toVerify: boolean }> = [
  {
    value: 'mario.rossi@verified.it',
    code: '12345',
    toVerify: false,
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
      // simulate 200
      if (!mockedContact) {
        mockedContacts.push({ value: body.value, code: '12345', toVerify: true });
        return resolve();
      }
      if (mockedContact && mockedContact.toVerify && !body.verificationCode) {
        return resolve();
      }
      // check code - simulate 406
      if (mockedContact.toVerify && body.verificationCode !== mockedContact.code) {
        return reject({ response: { status: 406 }, blockNotification: true });
      }
      mockedContact.toVerify = false;
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
