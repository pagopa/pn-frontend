import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { ConsentActionType, ConsentType } from '../../../models/consents';
import { apiClient } from '../../apiClients';
import { ConsentsApi } from '../Consents.api';
import { GET_CONSENTS, SET_CONSENTS } from '../consents.routes';
import { cleanupMock, mockApi } from '../../../__test__/test-utils';

describe('Consents api tests', () => {
  mockAuthentication();

  it('getConsentByType', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      GET_CONSENTS(ConsentType.TOS),
      200,
      undefined,
      { recipientId: 'mocked-recipientId', consentType: ConsentType.TOS, accepted: false },
    );
    const res = await ConsentsApi.getConsentByType(ConsentType.TOS);
    expect(res).toStrictEqual({ recipientId: 'mocked-recipientId', consentType: ConsentType.TOS, accepted: false });
    cleanupMock(mock);
  });

  it('getConsentByType with status code 400', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      GET_CONSENTS(ConsentType.TOS),
      400,
      undefined,
      { error: 'Invalid request' },
    );
    await expect(ConsentsApi.getConsentByType(ConsentType.TOS))
    .rejects.toThrow("Request failed with status code 400");
    cleanupMock(mock);
  });

  it('setConsentByType', async () => {
    const mock = mockApi(
      apiClient,
      'PUT',
      SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'),
      200,
      undefined,
      { action: ConsentActionType.ACCEPT },
    );
    const res = await ConsentsApi.setConsentByType(ConsentType.TOS, 'mocked-version-1', { action: ConsentActionType.ACCEPT });
    expect(res).toStrictEqual('success');
    cleanupMock(mock);
  });

  it('setConsentByType with status code 400', async () => {
    const mock = mockApi(
      apiClient,
      'PUT',
      SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'),
      400,
      undefined,
      { error: 'Invalid request' },
    );
    await expect(
      ConsentsApi.setConsentByType(
        ConsentType.TOS,
        'mocked-version-1',
        { action: ConsentActionType.ACCEPT }))
      .rejects.toThrow("Request failed with status code 400");
    cleanupMock(mock);
  });
});
