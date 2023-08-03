import MockAdapter from 'axios-mock-adapter';

import { mockApi } from '../../../__test__/test-utils';
import { ConsentActionType, ConsentType } from '../../../models/consents';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { apiClient } from '../../apiClients';
import { ConsentsApi } from '../Consents.api';
import { GET_CONSENTS, SET_CONSENTS } from '../consents.routes';

describe('Consents api tests', () => {
  let mock: MockAdapter;

  mockAuthentication();

  afterEach(() => {
    if (mock) {
      mock.restore();
      mock.reset();
    }
  });

  it('getConsentByType', async () => {
    mock = mockApi(apiClient, 'GET', GET_CONSENTS(ConsentType.TOS), 200, undefined, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: false,
    });
    const res = await ConsentsApi.getConsentByType(ConsentType.TOS);
    expect(res).toStrictEqual({
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: false,
    });
  });

  it('setConsentByType - 200', async () => {
    mock = mockApi(apiClient, 'PUT', SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'), 200, {
      action: ConsentActionType.ACCEPT,
    });
    const res = await ConsentsApi.setConsentByType(ConsentType.TOS, 'mocked-version-1', {
      action: ConsentActionType.ACCEPT,
    });
    expect(res).toStrictEqual('success');
  });

  it('setConsentByType - 20x', async () => {
    mock = mockApi(apiClient, 'PUT', SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'), 204, {
      action: ConsentActionType.ACCEPT,
    });
    const res = await ConsentsApi.setConsentByType(ConsentType.TOS, 'mocked-version-1', {
      action: ConsentActionType.ACCEPT,
    });
    expect(res).toStrictEqual('error');
  });
});
