import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { ConsentActionType, ConsentType } from '../../../models/consents';
import { apiClient } from '../../axios';
import { ConsentsApi } from '../Consents.api';
import { CONSENTS } from '../consents.routes';

describe('Consents api tests', () => {
  mockAuthentication();

  it('getConsentByType', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(CONSENTS(ConsentType.TOS)).reply(200, {recipientId: 'mocked-recipientId', consentType: ConsentType.TOS, accepted: false});
    const res = await ConsentsApi.getConsentByType(ConsentType.TOS);
    expect(res).toStrictEqual({recipientId: 'mocked-recipientId', consentType: ConsentType.TOS, accepted: false});
    mock.reset();
    mock.restore();
  });

  it('setConsentByType', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPut(CONSENTS(ConsentType.TOS), {action: ConsentActionType.ACCEPT}).reply(200);
    const res = await ConsentsApi.setConsentByType(ConsentType.TOS, {action: ConsentActionType.ACCEPT});
    expect(res).toStrictEqual('success');
    mock.reset();
    mock.restore();
  });
});
