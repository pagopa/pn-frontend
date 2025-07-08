import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { apiClient } from '../../apiClients';
import { SupportApi } from '../Support.api';
import { ZENDESK_AUTHORIZATION } from '../support.routes';

describe('Support api tests', () => {
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

  it('zendeskAuthorization without technical data', async () => {
    const params = {
      email: 'mail@di-prova.it',
    };
    const response = {
      action: 'https://zendesk-url.com',
      jwt: 'zendesk-jwt',
      return_to: 'https://suuport-url.com',
    };

    mock.onPost(ZENDESK_AUTHORIZATION(), params).reply(200, response);
    const res = await SupportApi.zendeskAuthorization(params);
    expect(res).toStrictEqual(response);
  });

  it('zendeskAuthorization with technical data', async () => {
    const params = {
      email: 'mail@di-prova.it',
      data: {
        traceId: 'fake-traceId',
      },
    };
    const response = {
      action: 'https://zendesk-url.com',
      jwt: 'zendesk-jwt',
      return_to: 'https://suuport-url.com',
    };

    mock.onPost(ZENDESK_AUTHORIZATION(), params).reply(200, response);
    const res = await SupportApi.zendeskAuthorization(params);
    expect(res).toStrictEqual(response);
  });
});
