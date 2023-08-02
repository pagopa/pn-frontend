import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { digitalAddresses } from '../../../redux/contact/__test__/test-utils';
import { LegalChannelType, CourtesyChannelType } from '../../../models/contacts';
import { mockApi, cleanupMock } from '../../../__test__/test-utils';
import { apiClient } from '../../apiClients';
import { ContactsApi } from '../Contacts.api';
import { CONTACTS_LIST, COURTESY_CONTACT, LEGAL_CONTACT } from '../contacts.routes';

describe('Contacts api tests', () => {
  mockAuthentication();

  it('getDigitalAddresses', async () => {
    const mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 200, undefined, digitalAddresses);
    const res = await ContactsApi.getDigitalAddresses();
    expect(res).toStrictEqual(digitalAddresses);
    cleanupMock(mock);
  });

  it('getDigitalAddresses with status code 400', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      CONTACTS_LIST(),
      400,
      { Error: 'Invalid Request' });
    await expect(ContactsApi.getDigitalAddresses())
      .rejects
      .toThrowError('Request failed with status code 400');
    cleanupMock(mock);
  });

  describe('createOrUpdateDigitalAddress', () => {
    it('digital email to verify', async () => {
      const body = { value: 'a@a.it' };
      const mock = mockApi(
        apiClient,
        'POST',
        LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC),
        200,
        body
      );
      const res = await ContactsApi.createOrUpdateLegalAddress(
        'mocked-recipientId',
        'mocked-senderId',
        LegalChannelType.PEC,
        body
      );
      expect(res).toStrictEqual(undefined);
      cleanupMock(mock);
    });

    it('digital email to validate', async () => {
      const body = { value: 'a@a.it', verificationCode: '12345' };
      const mock = mockApi(
        apiClient,
        'POST',
        LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC),
        200,
        body,
        { result: 'PEC_VALIDATION_REQUIRED' }
      );
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
      cleanupMock(mock);
    });

    it('digital email verified', async () => {
      const body = { value: 'a@a.it', verificationCode: '12345' };
      const mock = mockApi(
        apiClient,
        'POST',
        LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC),
        204,
        body
      );
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
      cleanupMock(mock);
    });
  });

  describe('createOrUpdateCourtesyAddress', () => {
    it('courtesy email to verify', async () => {
      const body = { value: 'a@a.it', verificationCode: '12345' };
      const mock = mockApi(
        apiClient,
        'POST',
        COURTESY_CONTACT('mocked-senderId', CourtesyChannelType.EMAIL),
        200,
        body
      );
      const res = await ContactsApi.createOrUpdateCourtesyAddress(
        'mocked-recipientId',
        'mocked-senderId',
        CourtesyChannelType.EMAIL,
        body
      );
      expect(res).toStrictEqual(undefined);
      cleanupMock(mock);
    });

    it('courtesy email verified', async () => {
      const body = { value: 'a@a.it', verificationCode: '12345' };
      const mock = mockApi(
        apiClient,
        'POST',
        COURTESY_CONTACT('mocked-senderId', CourtesyChannelType.EMAIL),
        204,
        body
      );
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
      cleanupMock(mock);
    });
  });

  it('deleteLegalAddress', async () => {
    const mock = mockApi(
      apiClient,
      'DELETE',
      LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC),
      204
    );
    const res = await ContactsApi.deleteLegalAddress('mocked-senderId', LegalChannelType.PEC);
    expect(res).toStrictEqual('mocked-senderId');
    cleanupMock(mock);
  });

  it('deleteCourtesyAddress', async () => {
    const mock = mockApi(
      apiClient,
      'DELETE',
      COURTESY_CONTACT('mocked-senderId', CourtesyChannelType.EMAIL),
      204
    );
    const res = await ContactsApi.deleteCourtesyAddress(
      'mocked-senderId',
      CourtesyChannelType.EMAIL
    );
    expect(res).toStrictEqual('mocked-senderId');
    cleanupMock(mock);
  });
});
