import {
  EventAction,
  EventCategory,
  EventDowntimeType,
  EventPropertyType,
} from '@pagopa-pn/pn-commons';

import { notificationToFe, paymentsData } from '../../../__mocks__/NotificationDetail.mock';
import { notificationsDTO } from '../../../__mocks__/Notifications.mock';
import { PGEventsType } from '../../../models/PGEventsType';
import { ChannelType } from '../../../models/contacts';
import { notificationTrackingConfigs } from '../notificationEvents';

describe('notificationTrackingConfigs', () => {
  it('should build SEND_PG_YOUR_NOTIFICATION screen view event', () => {
    const result = notificationTrackingConfigs[PGEventsType.SEND_PG_YOUR_NOTIFICATION]({
      notifications: notificationsDTO.resultsPage,
      pageNumber: 0,
      domicileBannerType: ChannelType.SERCQ_SEND,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        page_number: 0,
        unread_count: 1,
        total_count: 3,
        delivered_count: 0,
        opened_count: 2,
        expired_count: 1,
        not_found_count: 0,
        cancelled_count: 0,
        effective_date_count: 1,
        banner: ChannelType.SERCQ_SEND,
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it('should build SEND_PG_NOTIFICATION_DETAIL screen view event', () => {
    const result = notificationTrackingConfigs[PGEventsType.SEND_PG_NOTIFICATION_DETAIL]({
      downtimeEvents: [],
      mandateId: undefined,
      notificationStatus: notificationToFe.notificationStatus,
      checkIfUserHasPayments: true,
      userPayments: paymentsData,
      timeline: notificationToFe.timeline,
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
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });
});
