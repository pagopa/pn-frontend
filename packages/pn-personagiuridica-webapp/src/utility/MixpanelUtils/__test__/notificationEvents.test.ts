import {
  EventAction,
  EventCategory,
  EventDowntimeType,
  EventPropertyType,
  NotificationStatus,
} from '@pagopa-pn/pn-commons';

import type { PGEventPayloads } from '../../../models/PGEventPayloads';
import { PGEventsType } from '../../../models/PGEventsType';
import { ChannelType } from '../../../models/contacts';
import { notificationTrackingConfigs } from '../notificationEvents';

const notificationListPayload: PGEventPayloads[PGEventsType.SEND_PG_YOUR_NOTIFICATION] = {
  page_number: 1,
  unread_count: 2,
  total_count: 10,
  delivered_count: 3,
  opened_count: 4,
  expired_count: 1,
  not_found_count: 0,
  cancelled_count: 0,
  effective_date_count: 5,
};

describe('notificationTrackingConfigs', () => {
  it('should build SEND_PG_NOTIFICATION_DETAIL event', () => {
    const result = notificationTrackingConfigs[PGEventsType.SEND_PG_NOTIFICATION_DETAIL]({
      notification_owner: true,
      notification_status: NotificationStatus.DELIVERED,
      contains_payment: true,
      disservice_status: EventDowntimeType.NOT_DISSERVICE,
      contains_multipayment: 'no',
      count_payment: 1,
      contains_f24: 'no',
      first_time_opening: true,
      source: 'LISTA_NOTIFICHE',
      elapsed_time: 0,
      flow: 'digital',
      delivery_mode: 'async',
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        notification_owner: true,
        notification_status: NotificationStatus.DELIVERED,
        contains_payment: true,
        disservice_status: EventDowntimeType.NOT_DISSERVICE,
        contains_multipayment: 'no',
        count_payment: 1,
        contains_f24: 'no',
        first_time_opening: true,
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
        notificationListPayload
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
      ...notificationListPayload,
      banner: ChannelType.SERCQ_SEND,
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
});
