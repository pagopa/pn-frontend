import {
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from '../notifications.routes';

describe('Notifications routes', () => {
  it('should compile NOTIFICATION_PAYMENT_ATTACHMENT', () => {
    const route = NOTIFICATION_PAYMENT_ATTACHMENT('mocked-iun', 'mocked-attachmentName');
    expect(route).toEqual(
      '/delivery/notifications/received/mocked-iun/attachments/payment/mocked-attachmentName'
    );
  });

  it('should compile NOTIFICATION_PAYMENT_INFO', () => {
    const route = NOTIFICATION_PAYMENT_INFO();
    expect(route).toEqual('/ext-registry/pagopa/v2.1/paymentinfo');
  });

  it('should compile NOTIFICATION_PAYMENT_URL', () => {
    const route = NOTIFICATION_PAYMENT_URL();
    expect(route).toEqual('/ext-registry/pagopa/v1/checkout-cart');
  });

  it('should compile NOTIFICATION_ID_FROM_QRCODE', () => {
    const route = NOTIFICATION_ID_FROM_QRCODE();
    expect(route).toEqual('/delivery/notifications/received/check-aar-qr-code');
  });
});
