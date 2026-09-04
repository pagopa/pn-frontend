import {
  AppRouteParams,
  Downtime,
  EventAction,
  EventCategory,
  EventDowntimeType,
  EventNotificationDetailType,
  EventNotificationTypes,
  EventPropertyType,
  EventStrategy,
  F24PaymentDetails,
  INotificationDetailTimeline,
  NotificationStatus,
  NotificationStatusHistory,
  PaymentDetails,
  TimelineCategory,
  TrackedEvent,
  getElapsedTime,
} from '@pagopa-pn/pn-commons';
import {
  EventDeliveryFlowType,
  EventDeliveryModeType,
  EventNotificationType,
} from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';

import { appRouteParamToEventSource } from '../../notification.utility';

type NotificationData = {
  downtimeEvents: Array<Downtime>;
  mandateId: string | undefined;
  notificationStatus: NotificationStatus;
  checkIfUserHasPayments: boolean;
  userPayments?: { pagoPaF24: Array<PaymentDetails>; f24Only: Array<F24PaymentDetails> };
  paymentCount?: number;
  source: AppRouteParams | undefined;
  timeline: Array<INotificationDetailTimeline>;
  notificationStatusHistory?: Array<NotificationStatusHistory>;
  flow: EventDeliveryFlowType;
  delivery_mode: EventDeliveryModeType;
  notification_type: EventNotificationType;
};

const getInformalElapsedTime = (timeline: Array<INotificationDetailTimeline>): number => {
  const deliveredEvent = timeline.find((event) => event.category === TimelineCategory.DELIVERED);

  const viewedEvent = timeline.find(
    (event) => event.category === TimelineCategory.INFORMAL_NOTIFICATION_VIEWED
  );

  return getElapsedTime(deliveredEvent?.eventTimestamp, viewedEvent?.eventTimestamp);
};

const getPaymentProperties = (
  isInformalNotification: boolean,
  paymentCount: number | undefined,
  checkIfUserHasPayments: boolean,
  userPayments?: {
    pagoPaF24: Array<PaymentDetails>;
    f24Only: Array<F24PaymentDetails>;
  }
) => {
  if (isInformalNotification) {
    const informalPaymentCount = paymentCount ?? 0;

    return {
      containsPayment: informalPaymentCount > 0,
      containsMultipayment: informalPaymentCount > 1 ? ('yes' as const) : ('no' as const),
      countPayment: informalPaymentCount,
      containsF24: 'no' as const,
    };
  }

  const pagoPaF24 = userPayments?.pagoPaF24 ?? [];
  const f24Only = userPayments?.f24Only ?? [];

  const hasF24 = f24Only.length > 0 || pagoPaF24.some((payment) => payment.f24);

  return {
    containsPayment: checkIfUserHasPayments,
    containsMultipayment:
      f24Only.length + pagoPaF24.length > 1 ? ('yes' as const) : ('no' as const),
    countPayment: pagoPaF24.filter((payment) => payment.pagoPa).length,
    containsF24: hasF24 ? ('yes' as const) : ('no' as const),
  };
};

export class SendNotificationDetailStrategy implements EventStrategy {
  performComputations({
    downtimeEvents,
    mandateId,
    notificationStatus,
    checkIfUserHasPayments,
    userPayments,
    paymentCount,
    source,
    timeline,
    notificationStatusHistory,
    flow,
    delivery_mode,
    notification_type,
  }: NotificationData): TrackedEvent<EventNotificationDetailType> {
    // eslint-disable-next-line functional/no-let
    let typeDowntime: EventDowntimeType;

    if (downtimeEvents.length === 0) {
      typeDowntime = EventDowntimeType.NOT_DISSERVICE;
    } else {
      typeDowntime =
        downtimeEvents.filter((downtime) => !!downtime.endDate).length === downtimeEvents.length
          ? EventDowntimeType.COMPLETED
          : EventDowntimeType.IN_PROGRESS;
    }

    const viewedEvent = notificationStatusHistory?.find(
      (el) => el.status === NotificationStatus.VIEWED
    );

    const deliveredEvent = notificationStatusHistory?.find(
      (el) => el.status === NotificationStatus.DELIVERED
    );

    const isInformalNotification = notification_type === EventNotificationTypes.INFORMAL;

    const paymentProperties = getPaymentProperties(
      isInformalNotification,
      paymentCount,
      checkIfUserHasPayments,
      userPayments
    );

    const viewedTimelineCategory = isInformalNotification
      ? TimelineCategory.INFORMAL_NOTIFICATION_VIEWED
      : TimelineCategory.NOTIFICATION_VIEWED;

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        notification_owner: !mandateId,
        notification_status: notificationStatus,
        disservice_status: typeDowntime,
        contains_payment: paymentProperties.containsPayment,
        contains_multipayment: paymentProperties.containsMultipayment,
        count_payment: paymentProperties.countPayment,
        contains_f24: paymentProperties.containsF24,
        first_time_opening:
          timeline.findIndex((el) => el.category === viewedTimelineCategory) === -1,
        source: appRouteParamToEventSource(source) || 'LISTA_NOTIFICHE',
        elapsed_time: isInformalNotification
          ? getInformalElapsedTime(timeline)
          : getElapsedTime(deliveredEvent?.activeFrom, viewedEvent?.activeFrom),
        flow,
        delivery_mode,
        notification_type,
      },
    };
  }
}
