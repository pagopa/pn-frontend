import {
  AppRouteParams,
  Downtime,
  EventAction,
  EventCategory,
  EventDowntimeType,
  EventNotificationDetailType,
  EventPropertyType,
  EventStrategy,
  F24PaymentDetails,
  INotificationDetailTimeline,
  NotificationStatus,
  PaymentDetails,
  TimelineCategory,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';
import { appRouteParamToEventSource } from '../../notification.utility';

type NotificationData = {
  downtimeEvents: Array<Downtime>;
  mandateId: string | undefined;
  notificationStatus: NotificationStatus;
  checkIfUserHasPayments: boolean;
  userPayments: { pagoPaF24: Array<PaymentDetails>; f24Only: Array<F24PaymentDetails> };
  source: AppRouteParams | undefined;
  timeline: Array<INotificationDetailTimeline>;
};

export class SendNotificationDetailStrategy implements EventStrategy {
  performComputations({
    downtimeEvents,
    mandateId,
    notificationStatus,
    checkIfUserHasPayments,
    userPayments,
    source,
    timeline,
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

    const hasF24 =
      userPayments.f24Only.length > 0 ||
      userPayments.pagoPaF24.filter((payment) => payment.f24).length > 0;

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        notification_owner: !mandateId,
        notification_status: notificationStatus,
        contains_payment: checkIfUserHasPayments,
        disservice_status: typeDowntime,
        contains_multipayment:
          userPayments.f24Only.length + userPayments.pagoPaF24.length > 1 ? 'yes' : 'no',
        count_payment: userPayments.pagoPaF24.filter((payment) => payment.pagoPa).length,
        contains_f24: hasF24 ? 'yes' : 'no',
        first_time_opening:
          timeline.findIndex((el) => el.category === TimelineCategory.NOTIFICATION_VIEWED) === -1,
        source: appRouteParamToEventSource(source) || 'LISTA_NOTIFICHE',
      },
    };
  }
}