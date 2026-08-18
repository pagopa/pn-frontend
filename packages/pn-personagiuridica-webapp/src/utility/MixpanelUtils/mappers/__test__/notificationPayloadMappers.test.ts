import { vi } from 'vitest';

import type { LegalFactId } from '@pagopa-pn/pn-commons';
import {
  EventDowntimeType,
  InformalNotificationStatus,
  NotificationDocumentType,
  NotificationStatus,
  PaymentAttachmentSName,
} from '@pagopa-pn/pn-commons';

import {
  notificationToFe,
  paymentsData,
  statusHistory,
} from '../../../../__mocks__/NotificationDetail.mock';
import { notificationsDTO } from '../../../../__mocks__/Notifications.mock';
import { InformalTimelineElementCategoryV1 } from '../../../../generated-client/informal-notifications';
import {
  EventDefaultValue,
  MIXPANEL_NOTIFICATION_TYPE_MAP,
} from '../../../../models/PGEventPayloads';
import {
  mapNotificationAttachmentToDocumentDownloadPayload,
  mapNotificationDetailToEventPayload,
  mapNotificationListToEventPayload,
  mapStartPaymentToEventPayload,
  mapTimelineLegalFactToDocumentDownloadPayload,
} from '../notificationPayloadMappers';

describe('notificationPayloadMappers', () => {
  const deliveredAt = '2026-08-17T09:29:40Z';
  const firstOpeningAt = '2026-08-18T12:44:54Z';

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should map notification list data to event payload', () => {
    const payload = mapNotificationListToEventPayload({
      notifications: notificationsDTO.resultsPage,
      pageNumber: 0,
      domicileBannerType: 'SERCQ_SEND',
    });

    expect(payload).toStrictEqual({
      page_number: 0,
      total_count: 2,
      unread_count: 0,
      delivered_count: 0,
      opened_count: 1,
      expired_count: 1,
      not_found_count: 0,
      cancelled_count: 0,
      effective_date_count: 1,
      filed_count: 0,
      sending_count: 0,
      back_to_sender_count: 0,
      total_combo_count: 1,
      unread_combo_count: 1,
      delivered_combo_count: 0,
      opened_combo_count: 0,
      not_found_combo_count: 0,
      banner: 'SERCQ_SEND',
    });
  });

  it('should map informal notifications list data to event payload', () => {
    const payload = mapNotificationListToEventPayload({
      notifications: [
        {
          ...notificationsDTO.resultsPage[0],
          communicationType: 'INFORMAL',
          notificationStatus: InformalNotificationStatus.COMPLETED_REACHED,
          communicationOutcomes: {
            viewed: true,
            delivered: true,
          },
          isNewNotification: false,
        },
        {
          ...notificationsDTO.resultsPage[0],
          communicationType: 'INFORMAL',
          notificationStatus: InformalNotificationStatus.COMPLETED_UNREACHED,
          communicationOutcomes: {
            viewed: false,
            delivered: false,
          },
          isNewNotification: true,
        },
        {
          ...notificationsDTO.resultsPage[0],
          communicationType: 'LEGAL',
          notificationStatus: NotificationStatus.VIEWED,
          isNewNotification: false,
        },
      ],
      pageNumber: 1,
    });

    expect(payload).toStrictEqual({
      page_number: 1,
      total_count: 1,
      unread_count: 0,
      delivered_count: 0,
      opened_count: 1,
      expired_count: 0,
      not_found_count: 0,
      cancelled_count: 0,
      effective_date_count: 0,
      filed_count: 0,
      sending_count: 0,
      back_to_sender_count: 0,
      total_combo_count: 2,
      unread_combo_count: 1,
      delivered_combo_count: 1,
      opened_combo_count: 1,
      not_found_combo_count: 1,
    });
  });

  it('should map legal notification detail data to event payload', () => {
    const payload = mapNotificationDetailToEventPayload({
      notificationType: 'LEGAL',
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
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP.LEGAL,
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

  it('should map informal notification detail data on first opening', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(firstOpeningAt));

    const payload = mapNotificationDetailToEventPayload({
      notificationType: 'INFORMAL',
      notificationStatus: InformalNotificationStatus.ACCEPTED,
      paymentCount: 1,
      timeline: [
        {
          category: InformalTimelineElementCategoryV1.Delivered,
          eventTimestamp: deliveredAt,
        },
      ],
    });

    expect(payload).toStrictEqual({
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP.INFORMAL,
      notification_owner: true,
      notification_status: InformalNotificationStatus.ACCEPTED,
      contains_payment: true,
      disservice_status: EventDefaultValue.NOT_SET,
      contains_multipayment: 'no',
      count_payment: 1,
      contains_f24: 'no',
      first_time_opening: true,
      source: 'LISTA_NOTIFICHE',
      elapsed_time: 1,
      flow: EventDefaultValue.NOT_SET,
      delivery_mode: EventDefaultValue.NOT_SET,
    });
  });

  it('should map informal notification detail data after first opening', () => {
    const payload = mapNotificationDetailToEventPayload({
      notificationType: 'INFORMAL',
      notificationStatus: InformalNotificationStatus.ACCEPTED,
      paymentCount: 1,
      timeline: [
        {
          category: InformalTimelineElementCategoryV1.Delivered,
          eventTimestamp: deliveredAt,
        },
        {
          category: InformalTimelineElementCategoryV1.InformalNotificationViewed,
          eventTimestamp: firstOpeningAt,
        },
      ],
    });

    expect(payload).toStrictEqual({
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP.INFORMAL,
      notification_owner: true,
      notification_status: InformalNotificationStatus.ACCEPTED,
      contains_payment: true,
      disservice_status: EventDefaultValue.NOT_SET,
      contains_multipayment: 'no',
      count_payment: 1,
      contains_f24: 'no',
      first_time_opening: false,
      source: 'LISTA_NOTIFICHE',
      elapsed_time: 1,
      flow: EventDefaultValue.NOT_SET,
      delivery_mode: EventDefaultValue.NOT_SET,
    });
  });

  it('should map legal notification attachment to download payload', () => {
    const payload = mapNotificationAttachmentToDocumentDownloadPayload({
      notificationType: 'LEGAL',
      documentType: NotificationDocumentType.ATTACHMENT,
    });

    expect(payload).toStrictEqual({
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP.LEGAL,
      document_type: NotificationDocumentType.ATTACHMENT,
    });
  });

  it('should map legal notification AAR to download payload', () => {
    const payload = mapNotificationAttachmentToDocumentDownloadPayload({
      notificationType: 'LEGAL',
      documentType: NotificationDocumentType.AAR,
    });

    expect(payload).toStrictEqual({
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP.LEGAL,
      document_type: NotificationDocumentType.AAR,
    });
  });

  it('should map legal notification payment attachment to download payload', () => {
    const payload = mapNotificationAttachmentToDocumentDownloadPayload({
      notificationType: 'LEGAL',
      documentType: PaymentAttachmentSName.F24,
    });

    expect(payload).toStrictEqual({
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP.LEGAL,
      document_type: PaymentAttachmentSName.F24,
    });
  });

  it('should map informal notification attachment to download payload', () => {
    const payload = mapNotificationAttachmentToDocumentDownloadPayload({
      notificationType: 'INFORMAL',
      documentType: NotificationDocumentType.ATTACHMENT,
    });

    expect(payload).toStrictEqual({
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP.INFORMAL,
      document_type: NotificationDocumentType.ATTACHMENT,
    });
  });

  it('should map informal notification payment attachment to download payload', () => {
    const payload = mapNotificationAttachmentToDocumentDownloadPayload({
      notificationType: 'INFORMAL',
      documentType: PaymentAttachmentSName.PAGOPA,
    });

    expect(payload).toStrictEqual({
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP.INFORMAL,
      document_type: PaymentAttachmentSName.PAGOPA,
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

  it('should map legal notification start payment to event payload', () => {
    expect(
      mapStartPaymentToEventPayload({
        notificationType: 'LEGAL',
      })
    ).toStrictEqual({
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP.LEGAL,
      psp: 'pagopa',
    });
  });

  it('should map informal notification start payment to event payload', () => {
    expect(
      mapStartPaymentToEventPayload({
        notificationType: 'INFORMAL',
      })
    ).toStrictEqual({
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP.INFORMAL,
      psp: 'pagopa',
    });
  });
});
