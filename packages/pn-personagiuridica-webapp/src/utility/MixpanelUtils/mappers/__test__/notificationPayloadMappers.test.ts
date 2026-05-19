import { EventDowntimeType } from '@pagopa-pn/pn-commons';

import { notificationToFe, paymentsData } from '../../../../__mocks__/NotificationDetail.mock';
import { notificationsDTO } from '../../../../__mocks__/Notifications.mock';
import {
  mapNotificationDetailToEventPayload,
  mapNotificationListToEventPayload,
} from '../notificationPayloadMappers';

describe('notificationPayloadMappers', () => {
  it('should map notification list data to event payload', () => {
    const payload = mapNotificationListToEventPayload(
      notificationsDTO.resultsPage,
      0,
      'SERCQ_SEND'
    );

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
      timeline: notificationToFe.timeline,
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
    });
  });
});
