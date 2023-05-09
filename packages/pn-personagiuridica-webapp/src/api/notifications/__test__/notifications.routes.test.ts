import { LegalFactType } from '@pagopa-pn/pn-commons';

import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from '../notifications.routes';

describe('Notifications routes', () => {
  it('should compile NOTIFICATIONS_LIST', () => {
    const route = NOTIFICATIONS_LIST({
      startDate: 'start-date',
      endDate: 'end-date',
      recipientId: 'recipient-id',
      iunMatch: 'iun-match',
    });
    expect(route).toEqual(
      '/delivery/notifications/received?startDate=start-date&endDate=end-date&recipientId=RECIPIENT-ID&iunMatch=iun-match'
    );
  });

  it('should compile NOTIFICATIONS_LIST in case is delegated is true', () => {
    const route = NOTIFICATIONS_LIST({
        startDate: 'start-date',
        endDate: 'end-date',
        recipientId: 'recipient-id',
        iunMatch: 'iun-match',
      },
      true);
    expect(route).toEqual(
      '/delivery/notifications/received/delegated?startDate=start-date&endDate=end-date&recipientId=RECIPIENT-ID&iunMatch=iun-match'
    );
  });

  it('should compile NOTIFICATION_DETAIL', () => {
    const route = NOTIFICATION_DETAIL('mocked-iun');
    expect(route).toEqual('/delivery/notifications/received/mocked-iun');
  });

  it('should compile NOTIFICATION_DETAIL_DOCUMENTS', () => {
    const route = NOTIFICATION_DETAIL_DOCUMENTS('mocked-iun', '0');
    expect(route).toEqual('/delivery/notifications/received/mocked-iun/attachments/documents/0');
  });

  it('should compile NOTIFICATION_DETAIL_LEGALFACT', () => {
    const route = NOTIFICATION_DETAIL_LEGALFACT('mocked-iun', {
      key: 'mocked-key',
      category: LegalFactType.SENDER_ACK,
    });
    expect(route).toEqual('/delivery-push/mocked-iun/legal-facts/SENDER_ACK/mocked-key');
  });

  it('should compile NOTIFICATION_PAYMENT_ATTACHMENT', () => {
    const route = NOTIFICATION_PAYMENT_ATTACHMENT('mocked-iun', 'mocked-attachmentName');
    expect(route).toEqual('/delivery/notifications/received/mocked-iun/attachments/payment/mocked-attachmentName');
  });

  it('should compile NOTIFICATION_PAYMENT_INFO', () => {
    const route = NOTIFICATION_PAYMENT_INFO('mocked-taxId', 'mocked-noticeCode');
    expect(route).toEqual('/ext-registry/pagopa/v1/paymentinfo/mocked-taxId/mocked-noticeCode');
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
