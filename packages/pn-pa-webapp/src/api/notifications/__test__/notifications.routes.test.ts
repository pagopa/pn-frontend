import { LegalFactType } from '@pagopa-pn/pn-commons';

import {
  CANCEL_NOTIFICATION,
  CREATE_NOTIFICATION,
  GET_USER_GROUPS,
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PRELOAD_DOCUMENT,
} from '../notifications.routes';

describe('Notifications routes', () => {
  it('should compile NOTIFICATIONS_LIST', () => {
    const route = NOTIFICATIONS_LIST({
      startDate: 'start-date',
      endDate: 'end-date',
      recipientId: 'recipient-id',
      iunMatch: 'iun-match',
      status: '',
    });
    expect(route).toEqual(
      '/delivery/notifications/sent?startDate=start-date&endDate=end-date&recipientId=RECIPIENT-ID&iunMatch=iun-match'
    );
  });

  it('should compile NOTIFICATION_DETAIL', () => {
    const route = NOTIFICATION_DETAIL('mocked-iun');
    expect(route).toEqual('/delivery/v2.1/notifications/sent/mocked-iun');
  });

  it('should compile NOTIFICATION_DETAIL_DOCUMENTS', () => {
    const route = NOTIFICATION_DETAIL_DOCUMENTS('mocked-iun', '0');
    expect(route).toEqual('/delivery/notifications/sent/mocked-iun/attachments/documents/0');
  });

  it('should compile NOTIFICATION_DETAIL_OTHER_DOCUMENTS', () => {
    const route = NOTIFICATION_DETAIL_OTHER_DOCUMENTS('mocked-iun', {
      documentId: 'mocked-doc-id',
      documentType: 'mocked-doc-type',
    });
    expect(route).toEqual('/delivery-push/mocked-iun/document/mocked-doc-type');
  });

  it('should compile NOTIFICATION_DETAIL_LEGALFACT', () => {
    const route = NOTIFICATION_DETAIL_LEGALFACT('mocked-iun', {
      key: 'mocked-key',
      category: LegalFactType.SENDER_ACK,
    });
    expect(route).toEqual('/delivery-push/mocked-iun/legal-facts/SENDER_ACK/mocked-key');
  });

  it('should compile GET_USER_GROUPS', () => {
    const route = GET_USER_GROUPS();
    expect(route).toEqual('/ext-registry/pa/v1/groups');
  });

  it('should compile NOTIFICATION_PRELOAD_DOCUMENT', () => {
    const route = NOTIFICATION_PRELOAD_DOCUMENT();
    expect(route).toEqual('/delivery/attachments/preload');
  });

  it('should compile CREATE_NOTIFICATION', () => {
    const route = CREATE_NOTIFICATION();
    expect(route).toEqual('/delivery/v2.1/requests');
  });

  it('should compile NOTIFICATION_PAYMENT_ATTACHMENT', () => {
    const route = NOTIFICATION_PAYMENT_ATTACHMENT('mocked-iun', 'mocked-attachmentName', 0);
    expect(route).toEqual(
      '/delivery/notifications/sent/mocked-iun/attachments/payment/0/mocked-attachmentName'
    );
  });

  it('should compile CANCEL_NOTIFICATION', () => {
    const route = CANCEL_NOTIFICATION('mocked-iun');
    expect(route).toEqual('/delivery-push/v2.1/notifications/cancel/mocked-iun');
  });
});
