import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../redux/auth/__test__/reducers.test';
import { digitalAddresses } from '../../../redux/contact/__test__/test-utils';
import { LegalChannelType } from '../../../models/contacts';
import { apiClient } from '../../axios';
import { ContactsApi } from '../Contacts.api';

describe('Contacts api tests', () => {
  mockAuthentication();

  it('getDigitalAddresses', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(`/address-book/v1/digital-address/mocked-recipientId`).reply(200, digitalAddresses);
    const res = await ContactsApi.getDigitalAddresses('mocked-recipientId');
    expect(res).toStrictEqual(digitalAddresses);
    mock.reset();
    mock.restore();
  });

  it('createOrUpdateDigitalAddress (email to verify)', async () => {
    const mock = new MockAdapter(apiClient);
    const body = { value: 'a@a.it', verificationCode: '12345' };
    mock
      .onPost(
        `/address-book/v1/digital-address/mocked-recipientId/legal/mocked-senderId/${LegalChannelType.PEC}`,
        body
      )
      .reply(200, void 0);
    const res = await ContactsApi.createOrUpdateLegalAddress(
      'mocked-recipientId',
      'mocked-senderId',
      LegalChannelType.PEC,
      body
    );
    expect(res).toStrictEqual(void 0);
    mock.reset();
    mock.restore();
  });

  it.skip('createOrUpdateDigitalAddress (email verified)', async () => {
    const mock = new MockAdapter(apiClient);
    const body = { value: 'a@a.it', verificationCode: '12345' };
    mock
      .onPost(
        `/address-book/v1/digital-address/mocked-recipientId/legal/mocked-senderId/${LegalChannelType.PEC}`,
        body
      )
      .reply(204, void 0);
    const res = await ContactsApi.createOrUpdateLegalAddress(
      'mocked-recipientId',
      'mocked-senderId',
      LegalChannelType.PEC,
      body
    );
    expect(res).toStrictEqual({
      value: body.value,
      code: body.verificationCode,
      addressType: 'legal',
      channelType: LegalChannelType.PEC,
      recipientId: 'mocked-recipientId',
      senderId: 'mocked-senderId',
    });
    mock.reset();
    mock.restore();
  });
});
