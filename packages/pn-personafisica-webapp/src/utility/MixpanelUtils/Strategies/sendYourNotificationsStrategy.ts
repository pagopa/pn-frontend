import {
  EventAction,
  EventCategory,
  EventNotificationsListType,
  EventStrategy,
  Notification,
  NotificationStatus,
  TrackedEvent,
  isNewNotification,
} from '@pagopa-pn/pn-commons';

import { Delegator } from '../../../redux/delegation/types';

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

export class SendYourNotificationsStrategy implements EventStrategy {
  performComputations({
    notifications,
    delegators,
    pagination,
    domicileBannerType,
  }: SendYourNotifications): TrackedEvent<EventNotificationsListType> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.SCREEN_VIEW,
      ...{
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
      },
    };
  }
}
