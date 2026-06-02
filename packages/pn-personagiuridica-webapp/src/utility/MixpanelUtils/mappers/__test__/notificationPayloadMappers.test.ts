import type { LegalFactId, NotificationDetailOtherDocument } from '@pagopa-pn/pn-commons';
import { EventDowntimeType, NotificationDocumentType } from '@pagopa-pn/pn-commons';

import {
  notificationToFe,
  paymentsData,
  statusHistory,
} from '../../../../__mocks__/NotificationDetail.mock';
import { notificationsDTO } from '../../../../__mocks__/Notifications.mock';
import {
  mapNotificationAttachmentToDocumentDownloadPayload,
  mapNotificationDetailToEventPayload,
  mapNotificationListToEventPayload,
  mapStartPaymentToEventPayload,
  mapTimelineLegalFactToDocumentDownloadPayload,
} from '../notificationPayloadMappers';

describe('notificationPayloadMappers', () => {
  it('should map notification list data to event payload', () => {
    const payload = mapNotificationListToEventPayload({
      notifications: notificationsDTO.resultsPage,
      pageNumber: 0,
      domicileBannerType: 'SERCQ_SEND',
    });

    expect(payload).toStrictEqual({
      page_number: 0,
      total_count: 3,
      unread_count: 1,
      delivered_count: 0,
      opened_count: 2,
      expired_count: 1,
      not_found_count: 0,
      cancelled_count: 0,
      effective_date_count: 1,
      banner: 'SERCQ_SEND',
    });
  });

  it('should map notification detail data to event payload', () => {
    const payload = mapNotificationDetailToEventPayload({
      downtimeEvents: [],
      mandateId: undefined,
      notificationStatus: notificationToFe.notificationStatus,
      checkIfUserHasPayments: true,
      userPayments: paymentsData,
      notificationStatusHistory: statusHistory,
      source: 'LISTA_NOTIFICHE',
      flow: 'digital',
      deliveryMode: 'async',
    });

    expect(payload).toStrictEqual({
      notification_owner: true,
      notification_status: notificationToFe.notificationStatus,
      contains_payment: true,
      disservice_status: EventDowntimeType.NOT_DISSERVICE,
      contains_multipayment: 'yes',
      count_payment: 6,
      contains_f24: 'yes',
      first_time_opening: false,
      source: 'LISTA_NOTIFICHE',
      elapsed_time: 0,
      flow: 'digital',
      delivery_mode: 'async',
    });
  });

  it('should map notification attachment document to download payload', () => {
    const payload = mapNotificationAttachmentToDocumentDownloadPayload('0');

    expect(payload).toStrictEqual({
      document_type: NotificationDocumentType.ATTACHMENT,
    });
  });

  it('should map notification AAR document to download payload', () => {
    const payload = mapNotificationAttachmentToDocumentDownloadPayload({
      documentId: 'aar-document-id',
    } as NotificationDetailOtherDocument);

    expect(payload).toStrictEqual({
      document_type: NotificationDocumentType.AAR,
    });
  });

  it('should map timeline legal fact to download payload', () => {
    const payload = mapTimelineLegalFactToDocumentDownloadPayload({
      category: 'DIGITAL_DELIVERY',
    } as LegalFactId);

    expect(payload).toStrictEqual({
      document_type: 'DIGITAL_DELIVERY',
    });
  });

  it('should map start payment to event payload', () => {
    expect(mapStartPaymentToEventPayload()).toStrictEqual({
      psp: 'pagopa',
    });
  });
});
