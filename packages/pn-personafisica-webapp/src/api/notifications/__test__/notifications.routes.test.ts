import { LegalFactType } from '@pagopa-pn/pn-commons';

import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
  NOTIFICATION_ID_FROM_QRCODE,
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

  it('should compile NOTIFICATION_DETAIL_DOCUMENTS', () => {
    const route = NOTIFICATION_DETAIL_DOCUMENTS('mocked-iun', '0');
    expect(route).toEqual('/delivery/notifications/received/mocked-iun/attachments/documents/0');
  });

  it('should compile NOTIFICATION_DETAIL_OTHER_DOCUMENTS', () => {
    const route = NOTIFICATION_DETAIL_OTHER_DOCUMENTS('mocked-iun', {
      documentId: 'mocked-id',
      documentType: 'mocked-type',
    });
    expect(route).toEqual('/delivery-push/mocked-iun/document/mocked-type');
  });

  it('should compile NOTIFICATION_DETAIL_LEGALFACT', () => {
    const route = NOTIFICATION_DETAIL_LEGALFACT('mocked-iun', {
      key: 'mocked-key',
      category: LegalFactType.SENDER_ACK,
    });
    expect(route).toEqual('/delivery-push/mocked-iun/legal-facts/SENDER_ACK/mocked-key');
  });

  it('should compile NOTIFICATION_ID_FROM_QRCODE', () => {
    const route = NOTIFICATION_ID_FROM_QRCODE();
    expect(route).toEqual('/delivery/notifications/received/check-aar-qr-code');
  });
});
