import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { CourtesyChannelType, LegalChannelType } from '../../../models/contacts';
import { apiClient } from '../../apiClients';
import { ContactsApi } from '../Contacts.api';
import { CONTACTS_LIST, COURTESY_CONTACT, LEGAL_CONTACT } from '../contacts.routes';

describe('Contacts api tests', () => {
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('getDigitalAddresses', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    const res = await ContactsApi.getDigitalAddresses();
    expect(res).toStrictEqual(digitalAddresses);
  });

  it('createOrUpdateDigitalAddress (pec to verify)', async () => {
    const body = { value: 'a@a.it' };
    mock.onPost(LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC)).reply(200, body);
    const res = await ContactsApi.createOrUpdateLegalAddress(
      'mocked-recipientId',
      'mocked-senderId',
      LegalChannelType.PEC,
      body
    );
    expect(res).toStrictEqual(undefined);
  });

  it('createOrUpdateDigitalAddress (pec to validate)', async () => {
    const body = { value: 'a@a.it', verificationCode: '12345' };
    mock.onPost(LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC)).reply(200, {
      result: 'PEC_VALIDATION_REQUIRED',
    });
    const res = await ContactsApi.createOrUpdateLegalAddress(
      'mocked-recipientId',
      'mocked-senderId',
      LegalChannelType.PEC,
      body
    );
    expect(res).toStrictEqual({
      value: '',
      pecValid: false,
      addressType: 'legal',
      channelType: LegalChannelType.PEC,
      recipientId: 'mocked-recipientId',
      senderId: 'mocked-senderId',
      senderName: undefined,
    });
  });

  it('createOrUpdateDigitalAddress (pec verified)', async () => {
    const body = { value: 'a@a.it', verificationCode: '12345' };
    mock.onPost(LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC)).reply(204, {
      result: 'PEC_VALIDATION_REQUIRED',
    });
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
  });

  it('deleteLegalAddress', async () => {
    mock.onDelete(LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC)).reply(204);
    const res = await ContactsApi.deleteLegalAddress('mocked-senderId', LegalChannelType.PEC);
    expect(res).toStrictEqual('mocked-senderId');
  });

  it('createOrUpdateCourtesyAddress (email to verify)', async () => {
    const body = { value: 'a@a.it', verificationCode: '12345' };
    mock.onPost(COURTESY_CONTACT('mocked-senderId', CourtesyChannelType.EMAIL)).reply(200, body);
    const res = await ContactsApi.createOrUpdateCourtesyAddress(
      'mocked-recipientId',
      'mocked-senderId',
      CourtesyChannelType.EMAIL,
      body
    );
    expect(res).toStrictEqual(undefined);
  });

  it('createOrUpdateCourtesyAddress (email verified)', async () => {
    const body = { value: 'a@a.it', verificationCode: '12345' };
    mock.onPost(COURTESY_CONTACT('mocked-senderId', CourtesyChannelType.EMAIL)).reply(204, body);
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
  });

  it('deleteCourtesyAddress', async () => {
    mock.onDelete(COURTESY_CONTACT('mocked-senderId', CourtesyChannelType.EMAIL)).reply(204);
    const res = await ContactsApi.deleteCourtesyAddress(
      'mocked-senderId',
      CourtesyChannelType.EMAIL
    );
    expect(res).toStrictEqual('mocked-senderId');
  });
});
