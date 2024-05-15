import {
  CREATE_NOTIFICATION,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PRELOAD_DOCUMENT,
} from '../notifications.routes';

describe('Notifications routes', () => {
  it('should compile NOTIFICATION_PRELOAD_DOCUMENT', () => {
    const route = NOTIFICATION_PRELOAD_DOCUMENT();
    expect(route).toEqual('/delivery/attachments/preload');
  });

  it('should compile CREATE_NOTIFICATION', () => {
    const route = CREATE_NOTIFICATION();
    expect(route).toEqual('/delivery/v2.3/requests');
  });

  it('should compile NOTIFICATION_PAYMENT_ATTACHMENT', () => {
    const route = NOTIFICATION_PAYMENT_ATTACHMENT('mocked-iun', 'mocked-attachmentName', 0);
    expect(route).toEqual(
      '/delivery/notifications/sent/mocked-iun/attachments/payment/0/mocked-attachmentName'
    );
  });
});
