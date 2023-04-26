import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { digitalAddresses } from '../../../redux/contact/__test__/test-utils';
import { LegalChannelType, CourtesyChannelType } from '../../../models/contacts';
import { apiClient } from '../../apiClients';
import { ContactsApi } from '../Contacts.api';
import { CONTACTS_LIST, COURTESY_CONTACT, LEGAL_CONTACT } from '../contacts.routes';

describe('Contacts api tests', () => {
  mockAuthentication();

  it('getDigitalAddresses', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    const res = await ContactsApi.getDigitalAddresses();
    expect(res).toStrictEqual(digitalAddresses);
    mock.reset();
    mock.restore();
  });

  it('createOrUpdateDigitalAddress (email to verify)', async () => {
    const mock = new MockAdapter(apiClient);
    const body = { value: 'a@a.it', verificationCode: '12345' };
    mock.onPost(LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC), body).reply(200, void 0);
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

  it('createOrUpdateDigitalAddress (email verified)', async () => {
    const mock = new MockAdapter(apiClient);
    const body = { value: 'a@a.it', verificationCode: '12345' };
    mock.onPost(LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC), body).reply(204, void 0);
    const res = await ContactsApi.createOrUpdateLegalAddress(
      'mocked-recipientId',
      'mocked-senderId',
      LegalChannelType.PEC,
      body
    );
    expect(res).toStrictEqual({
      value: body.value,
      pecValid: true,
      addressType: 'legal',
      channelType: LegalChannelType.PEC,
      recipientId: 'mocked-recipientId',
      senderId: 'mocked-senderId',
      senderName: undefined,
    });
    mock.reset();
    mock.restore();
  });

  it('deleteLegalAddress', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onDelete(LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC)).reply(204, void 0);
    const res = await ContactsApi.deleteLegalAddress('mocked-senderId', LegalChannelType.PEC);
    expect(res).toStrictEqual('mocked-senderId');
    mock.reset();
    mock.restore();
  });

  it('createOrUpdateCourtesyAddress (email to verify)', async () => {
    const mock = new MockAdapter(apiClient);
    const body = { value: 'a@a.it', verificationCode: '12345' };
    mock
      .onPost(COURTESY_CONTACT('mocked-senderId', CourtesyChannelType.EMAIL), body)
      .reply(200, void 0);
    const res = await ContactsApi.createOrUpdateCourtesyAddress(
      'mocked-recipientId',
      'mocked-senderId',
      CourtesyChannelType.EMAIL,
      body
    );
    expect(res).toStrictEqual(void 0);
    mock.reset();
    mock.restore();
  });

  it('createOrUpdateCourtesyAddress (email verified)', async () => {
    const mock = new MockAdapter(apiClient);
    const body = { value: 'a@a.it', verificationCode: '12345' };
    mock
      .onPost(COURTESY_CONTACT('mocked-senderId', CourtesyChannelType.EMAIL), body)
      .reply(204, void 0);
    const res = await ContactsApi.createOrUpdateCourtesyAddress(
      'mocked-recipientId',
      'mocked-senderId',
      CourtesyChannelType.EMAIL,
      body
    );
    expect(res).toStrictEqual({
      value: body.value,
      addressType: 'courtesy',
      channelType: CourtesyChannelType.EMAIL,
      recipientId: 'mocked-recipientId',
      senderId: 'mocked-senderId',
      senderName: undefined,
    });
    mock.reset();
    mock.restore();
  });

  it('deleteCourtesyAddress', async () => {
    const mock = new MockAdapter(apiClient);
    mock
      .onDelete(COURTESY_CONTACT('mocked-senderId', CourtesyChannelType.EMAIL))
      .reply(204, void 0);
    const res = await ContactsApi.deleteCourtesyAddress(
      'mocked-senderId',
      CourtesyChannelType.EMAIL
    );
    expect(res).toStrictEqual('mocked-senderId');
    mock.reset();
    mock.restore();
  });
});
