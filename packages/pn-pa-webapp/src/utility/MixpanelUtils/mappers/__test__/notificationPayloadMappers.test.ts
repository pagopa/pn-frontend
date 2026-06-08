import type { LegalFactId, NotificationDetailOtherDocument } from '@pagopa-pn/pn-commons';
import { NotificationDocumentType } from '@pagopa-pn/pn-commons';

import { notificationsDTO } from '../../../../__mocks__/Notifications.mock';
import {
  mapNotificationAttachmentToDocumentDownloadPayload,
  mapNotificationListToEventPayload,
  mapTimelineLegalFactToDocumentDownloadPayload,
} from '../notificationPayloadMappers';

describe('notificationPayloadMappers', () => {
  it('should map notification list data to event payload', () => {
    const payload = mapNotificationListToEventPayload({
      notifications: notificationsDTO.resultsPage,
      pageNumber: 0,
    });

    expect(payload).toStrictEqual({
      page_number: 0,
      total_count: 4,
      delivered_count: 1,
      opened_count: 0,
      not_found_count: 0,
      cancelled_count: 0,
      effective_date_count: 2,
      filed_count: 1,
      sending_count: 0,
    });
  });

  it('should map notification attachment document to download payload', () => {
    const payload = mapNotificationAttachmentToDocumentDownloadPayload({
      document: '0',
    });

    expect(payload).toStrictEqual({
      document_type: NotificationDocumentType.ATTACHMENT,
    });
  });

  it('should map notification AAR document to download payload', () => {
    const payload = mapNotificationAttachmentToDocumentDownloadPayload({
      document: {
        documentId: 'aar-document-id',
      } as NotificationDetailOtherDocument,
    });

    expect(payload).toStrictEqual({
      document_type: NotificationDocumentType.AAR,
    });
  });

  it('should map timeline legal fact to download payload', () => {
    const payload = mapTimelineLegalFactToDocumentDownloadPayload({
      legalFact: {
        category: 'DIGITAL_DELIVERY',
      } as LegalFactId,
    });

    expect(payload).toStrictEqual({
      document_type: 'DIGITAL_DELIVERY',
    });
  });
});
