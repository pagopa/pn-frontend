import {
  EventAction,
  EventCategory,
  EventPropertyType,
  NotificationStatus,
} from '@pagopa-pn/pn-commons';

import { mandatesByDelegate } from '../../../../__mocks__/Delegations.mock';
import { notificationsDTO } from '../../../../__mocks__/Notifications.mock';
import { SendYourNotificationsStrategy } from '../SendYourNotificationsStrategy';

describe('Mixpanel - Send Your Notification Strategy', () => {
  it('should return your notification strategy event', () => {
    const strategy = new SendYourNotificationsStrategy();

    const yourNotification = {
      notifications: notificationsDTO.resultsPage,
      delegators: mandatesByDelegate,
      pagination: {
        nextPagesKey: [],
        size: 1,
        page: 1,
        moreResult: false,
      },
      domicileBannerType: 'EMAIL',
    };

    const legalNotifications = yourNotification.notifications.filter(
      (notification) => notification.communicationType === 'LEGAL'
    );

    const comboNotifications = yourNotification.notifications.filter(
      (notification) => notification.communicationType === 'INFORMAL'
    );

    const yourNotificationEvent = strategy.performComputations(yourNotification);
    expect(yourNotificationEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        ...(yourNotification.domicileBannerType && { banner: yourNotification.domicileBannerType }),
        delegate: yourNotification.delegators.length > 0,
        page_number: yourNotification.pagination.page,
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
        unread_combo_count: comboNotifications.filter((n) => n.isNewNotification).length,

        total_combo_count: comboNotifications.length,

        delivered_combo_count: comboNotifications.filter(
          (n) => n.notificationStatus === NotificationStatus.DELIVERED
        ).length,

        opened_combo_count: comboNotifications.filter(
          (n) => n.notificationStatus === NotificationStatus.VIEWED
        ).length,

        not_found_combo_count: comboNotifications.filter(
          (n) => n.notificationStatus === NotificationStatus.UNREACHABLE
        ).length,
        onboarding: 'not_viewed',
      },
    });
  });
});
