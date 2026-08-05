import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  NOTIFICATION_COMMUNICATION_TYPE,
  NotificationStatus,
  RecipientNotification,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import {
  OnboardingAvailableFlows,
  OnboardingStatus,
  TrackingFlow,
} from '../../../models/Onboarding';
import { Delegator } from '../../../redux/delegation/types';
import { getOnboardingNotificationsPayload } from '../../mixpanel';

type SendYourNotifications = {
  notifications: Array<RecipientNotification>;
  delegators: Array<Delegator>;
  pagination: {
    nextPagesKey: Array<string>;
    size: number;
    page: number;
    moreResult: boolean;
  };
  domicileBannerType: string;
};

type EventNotificationsListType = {
  banner?: string;
  delegate: boolean;
  page_number: number;
  total_count: number;
  unread_count: number;
  delivered_count: number;
  opened_count: number;
  expired_count: number;
  not_found_count: number;
  cancelled_count: number;
  effective_date_count: number;
  onboarding: OnboardingStatus;
  onboarding_selected_flow?: OnboardingAvailableFlows;
  flow?: TrackingFlow;

  unread_combo_count: number;
  total_combo_count: number;
  delivered_combo_count: number;
  opened_combo_count: number;
  not_found_combo_count: number;
};

export class SendYourNotificationsStrategy implements EventStrategy {
  performComputations({
    notifications,
    delegators,
    pagination,
    domicileBannerType,
  }: SendYourNotifications): TrackedEvent<EventNotificationsListType> {
    const legalNotifications = notifications.filter(
      (notification) => notification.communicationType === NOTIFICATION_COMMUNICATION_TYPE.LEGAL
    );

    const comboNotifications = notifications.filter(
      (notification) => notification.communicationType === NOTIFICATION_COMMUNICATION_TYPE.INFORMAL
    );

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        ...(domicileBannerType && { banner: domicileBannerType }),
        delegate: delegators.length > 0,
        page_number: pagination.page,
        total_count: legalNotifications.length,
        unread_count: legalNotifications.filter((n) => n.isNewNotification).length,
        delivered_count: legalNotifications.filter(
          (n) => n.notificationStatus === NotificationStatus.DELIVERED
        ).length,
        opened_count: legalNotifications.filter(
          (n) => n.notificationStatus === NotificationStatus.VIEWED
        ).length,
        expired_count: legalNotifications.filter(
          (n) => n.notificationStatus === NotificationStatus.EFFECTIVE_DATE
        ).length,
        not_found_count: legalNotifications.filter(
          (n) => n.notificationStatus === NotificationStatus.UNREACHABLE
        ).length,
        cancelled_count: legalNotifications.filter(
          (n) => n.notificationStatus === NotificationStatus.CANCELLED
        ).length,
        effective_date_count: legalNotifications.filter(
          (n) => n.notificationStatus === NotificationStatus.EFFECTIVE_DATE
        ).length,

        unread_combo_count: comboNotifications.filter(
          (notification) => notification.isNewNotification
        ).length,
        total_combo_count: comboNotifications.length,
        delivered_combo_count: comboNotifications.filter(
          (notification) => notification.notificationStatus === NotificationStatus.DELIVERED
        ).length,
        opened_combo_count: comboNotifications.filter(
          (notification) => notification.notificationStatus === NotificationStatus.VIEWED
        ).length,
        not_found_combo_count: comboNotifications.filter(
          (notification) => notification.notificationStatus === NotificationStatus.UNREACHABLE
        ).length,
        ...getOnboardingNotificationsPayload(),
      },
    };
  }
}
