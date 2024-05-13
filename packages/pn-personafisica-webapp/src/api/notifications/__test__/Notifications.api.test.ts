import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { apiClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import { NOTIFICATION_ID_FROM_QRCODE } from '../notifications.routes';

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

  it('exchangeNotificationQrCode', async () => {
    mock.onPost(NOTIFICATION_ID_FROM_QRCODE(), { aarQrCodeValue: 'qr1' }).reply(200, {
      iun: 'mock-notification-1',
      mandateId: 'mock-mandate-1',
    });
    const res = await NotificationsApi.exchangeNotificationQrCode('qr1');
    expect(res).toStrictEqual({
      iun: 'mock-notification-1',
      mandateId: 'mock-mandate-1',
    });
  });
});
