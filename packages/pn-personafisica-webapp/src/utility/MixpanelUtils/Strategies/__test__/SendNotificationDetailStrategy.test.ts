import {
  AppRouteParams,
  DowntimeStatus,
  EventAction,
  EventCategory,
  EventDowntimeType,
  EventPropertyType,
  KnownFunctionality,
  NotificationStatus,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';

import { paymentsData, timeline } from '../../../../__mocks__/NotificationDetail.mock';
import { SendNotificationDetailStrategy } from '../SendNotificationDetailStrategy';

describe('Mixpanel - Notification detail Strategy', () => {
  it('should return notification detail event', () => {
    const strategy = new SendNotificationDetailStrategy();

    const notificationData = {
      downtimeEvents: [
        {
          functionality: KnownFunctionality.NotificationCreate,
          status: DowntimeStatus.KO,
          startDate: 'startDate',
          endDate: 'endDate',
        },
      ],
      mandateId: 'mandateId',
      notificationStatus: NotificationStatus.VIEWED,
      checkIfUserHasPayments: true,
      userPayments: {
        pagoPaF24: paymentsData.pagoPaF24,
        f24Only: paymentsData.f24Only,
      },
      source: AppRouteParams.AAR,
      timeline: timeline,
    };

    let typeDowntime: EventDowntimeType;

    if (notificationData.downtimeEvents.length === 0) {
      typeDowntime = EventDowntimeType.NOT_DISSERVICE;
    } else {
      typeDowntime =
        notificationData.downtimeEvents.filter((downtime) => !!downtime.endDate).length ===
        notificationData.downtimeEvents.length
          ? EventDowntimeType.COMPLETED
          : EventDowntimeType.IN_PROGRESS;
    }

    const hasF24 =
      paymentsData.f24Only.length > 0 ||
      paymentsData.pagoPaF24.filter((payment) => payment.f24).length > 0;

    const notificationDetailEvent = strategy.performComputations(notificationData);
    expect(notificationDetailEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        notification_owner: !notificationData.mandateId,
        notification_status: notificationData.notificationStatus,
        contains_payment: notificationData.checkIfUserHasPayments,
        disservice_status: typeDowntime,
        contains_multipayment:
          notificationData.userPayments.f24Only.length +
            notificationData.userPayments.pagoPaF24.length >
          1
            ? 'yes'
            : 'no',
        count_payment: notificationData.userPayments.pagoPaF24.filter((payment) => payment.pagoPa)
          .length,
        contains_f24: hasF24 ? 'yes' : 'no',
        first_time_opening:
          timeline.findIndex((el) => el.category === TimelineCategory.NOTIFICATION_VIEWED) === -1,
        source: 'QRcode',
      },
    });
  });
});
