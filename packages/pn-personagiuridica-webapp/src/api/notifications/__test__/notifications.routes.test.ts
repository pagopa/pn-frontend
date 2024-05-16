import { NOTIFICATION_ID_FROM_QRCODE } from '../notifications.routes';

describe('Notifications routes', () => {
  it('should compile NOTIFICATION_ID_FROM_QRCODE', () => {
    const route = NOTIFICATION_ID_FROM_QRCODE();
    expect(route).toEqual('/delivery/notifications/received/check-aar-qr-code');
  });
});
