import MockAdapter from 'axios-mock-adapter';

import { ConsentActionType, ConsentType } from '../../../models/consents';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { apiClient } from '../../apiClients';
import { ConsentsApi } from '../Consents.api';
import { GET_CONSENTS, SET_CONSENTS } from '../consents.routes';

describe('Consents api tests', () => {
  // eslint-disable-next-line functional/no-let
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

  it('getConsentByType', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
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

  it('setConsentByType', async () => {
    mock
      .onPut(SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    const res = await ConsentsApi.setConsentByType(ConsentType.TOS, 'mocked-version-1', {
      action: ConsentActionType.ACCEPT,
    });
    expect(res).toStrictEqual('success');
  });
});
