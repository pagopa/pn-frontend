import type { LegalFactId } from '@pagopa-pn/pn-commons';
import {
  EventAction,
  EventCategory,
  EventDowntimeType,
  EventPropertyType,
  NotificationDocumentType,
} from '@pagopa-pn/pn-commons';

import {
  notificationToFe,
  paymentsData,
  statusHistory,
} from '../../../__mocks__/NotificationDetail.mock';
import { notificationsDTO } from '../../../__mocks__/Notifications.mock';
import { PGEventsType } from '../../../models/PGEventsType';
import { ChannelType } from '../../../models/contacts';
import { notificationTrackingConfigs } from '../notificationEvents';

const notificationListEventData = {
  notifications: notificationsDTO.resultsPage,
  pageNumber: 0,
};

const notificationListPayload = {
  page_number: 0,
  unread_count: 1,
  total_count: 3,
  delivered_count: 0,
  opened_count: 2,
  expired_count: 1,
  not_found_count: 0,
  cancelled_count: 0,
  effective_date_count: 1,
  filed_count: 0,
};

describe('notificationTrackingConfigs', () => {
  it('should build SEND_PG_NOTIFICATION_DETAIL event', () => {
    const result = notificationTrackingConfigs[PGEventsType.SEND_PG_NOTIFICATION_DETAIL]({
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

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
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
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it('should build SEND_PG_NOTIFICATION_DELEGATED event', () => {
    const result =
      notificationTrackingConfigs[PGEventsType.SEND_PG_NOTIFICATION_DELEGATED](
        notificationListEventData
      );

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        ...notificationListPayload,
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it('should build SEND_PG_YOUR_NOTIFICATION event', () => {
    const result = notificationTrackingConfigs[PGEventsType.SEND_PG_YOUR_NOTIFICATION]({
      ...notificationListEventData,
      domicileBannerType: ChannelType.SERCQ_SEND,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        ...notificationListPayload,
        banner: ChannelType.SERCQ_SEND,
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it('should build SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT event', () => {
    const result = notificationTrackingConfigs[
      PGEventsType.SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT
    ]({
      document: '0',
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        document_type: NotificationDocumentType.ATTACHMENT,
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PG_TIMELINE_DOWNLOAD event', () => {
    const result = notificationTrackingConfigs[PGEventsType.SEND_PG_TIMELINE_DOWNLOAD]({
      legalFact: {
        category: 'DIGITAL_DELIVERY',
      } as LegalFactId,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        document_type: 'DIGITAL_DELIVERY',
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PG_START_PAYMENT event', () => {
    const result = notificationTrackingConfigs[PGEventsType.SEND_PG_START_PAYMENT](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        psp: 'pagopa',
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });
});
