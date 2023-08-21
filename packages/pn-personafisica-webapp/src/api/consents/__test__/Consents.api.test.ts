import MockAdapter from 'axios-mock-adapter';
import { ConsentActionType, ConsentType } from '../../../models/consents';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { apiClient } from '../../apiClients';
import { ConsentsApi } from '../Consents.api';
import { GET_CONSENTS, SET_CONSENTS } from '../consents.routes';

describe('Consents api tests', () => {
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

  it('setConsentByType - 200', async () => {
    mock.onPut(SET_CONSENTS(ConsentType.TOS, 'mocked-version-1')).reply(200, {
      action: ConsentActionType.ACCEPT,
    });
    const res = await ConsentsApi.setConsentByType(ConsentType.TOS, 'mocked-version-1', {
      action: ConsentActionType.ACCEPT,
    });
    expect(res).toStrictEqual('success');
  });

  it('setConsentByType - 20x', async () => {
    mock.onPut(SET_CONSENTS(ConsentType.TOS, 'mocked-version-1')).reply(204, {
      action: ConsentActionType.ACCEPT,
    });
    const res = await ConsentsApi.setConsentByType(ConsentType.TOS, 'mocked-version-1', {
      action: ConsentActionType.ACCEPT,
    });
    expect(res).toStrictEqual('error');
  });
});
