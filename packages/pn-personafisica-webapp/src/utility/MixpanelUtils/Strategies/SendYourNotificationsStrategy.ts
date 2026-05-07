import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  Notification,
  NotificationStatus,
  TrackedEvent,
  isNewNotification,
} from '@pagopa-pn/pn-commons';

import {
  OnboardingAvailableFlows,
  OnboardingStatus,
  TrackingFlow,
} from '../../../models/Onboarding';
import { Delegator } from '../../../redux/delegation/types';
import { getOnboardingNotificationsPayload } from '../../mixpanel';

type SendYourNotifications = {
  notifications: Array<Notification>;
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
};

export class SendYourNotificationsStrategy implements EventStrategy {
  performComputations({
    notifications,
    delegators,
    pagination,
    domicileBannerType,
  }: SendYourNotifications): TrackedEvent<EventNotificationsListType> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        ...(domicileBannerType && { banner: domicileBannerType }),
        delegate: delegators.length > 0,
        page_number: pagination.page,
        total_count: notifications.length,
        unread_count: notifications.filter((n) => isNewNotification(n.notificationStatus)).length,
        delivered_count: notifications.filter(
          (n) => n.notificationStatus === NotificationStatus.DELIVERED
        ).length,
        opened_count: notifications.filter(
          (n) => n.notificationStatus === NotificationStatus.VIEWED
        ).length,
        expired_count: notifications.filter(
          (n) => n.notificationStatus === NotificationStatus.EFFECTIVE_DATE
        ).length,
        not_found_count: notifications.filter(
          (n) => n.notificationStatus === NotificationStatus.UNREACHABLE
        ).length,
        cancelled_count: notifications.filter(
          (n) => n.notificationStatus === NotificationStatus.CANCELLED
        ).length,
        effective_date_count: notifications.filter(
          (n) => n.notificationStatus === NotificationStatus.EFFECTIVE_DATE
        ).length,
        ...getOnboardingNotificationsPayload(),
      },
    };
  }
}
