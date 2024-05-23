import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { apiClient, externalClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';

describe('Notifications api tests', () => {
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

  it('uploadNotificationDocument', async () => {
    const file = new Uint8Array();
    const extMock = new MockAdapter(externalClient);
    extMock.onPut(`https://mocked-url.com`).reply(200, undefined, {
      'x-amz-version-id': 'mocked-versionToken',
    });
    const res = await NotificationsApi.uploadNotificationDocument(
      'https://mocked-url.com',
      'mocked-sha256',
      'mocked-secret',
      file,
      'PUT'
    );
    expect(res).toStrictEqual('mocked-versionToken');
    extMock.reset();
    extMock.restore();
  });
});
