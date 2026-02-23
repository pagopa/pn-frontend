import { vi } from 'vitest';

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
import {
  EventDeliveryFlowType,
  EventDeliveryModeType,
} from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';

import { paymentsData, timeline } from '../../../../__mocks__/NotificationDetail.mock';
import { SendNotificationDetailStrategy } from '../SendNotificationDetailStrategy';

describe('Mixpanel - Notification detail Strategy', () => {
  const viewedDay = '2026-02-06T15:05:00.000Z';

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(viewedDay));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should return notification detail event', () => {
    const strategy = new SendNotificationDetailStrategy();

    const deliveredDay = '2025-02-01T15:05:00.000Z';

    const diffInMs = new Date(viewedDay).getTime() - new Date(deliveredDay).getTime();
    const elapsed_time = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

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
      notificationStatusHistory: [
        {
          status: NotificationStatus.DELIVERED,
          activeFrom: deliveredDay,
          relatedTimelineElements: [],
        },
        {
          status: NotificationStatus.VIEWED,
          activeFrom: viewedDay,
          relatedTimelineElements: [],
        },
      ],
      flow: 'digital' as EventDeliveryFlowType,
      delivery_mode: 'async' as EventDeliveryModeType,
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
        elapsed_time: elapsed_time,
        flow: 'digital' as EventDeliveryFlowType,
        delivery_mode: 'async' as EventDeliveryModeType,
      },
    });
  });
});
