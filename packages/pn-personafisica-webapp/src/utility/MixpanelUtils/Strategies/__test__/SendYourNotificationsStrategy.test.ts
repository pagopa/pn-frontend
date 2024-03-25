import {
  EventAction,
  EventCategory,
  NotificationStatus,
  isNewNotification,
} from '@pagopa-pn/pn-commons';

import { arrayOfDelegators } from '../../../../__mocks__/Delegations.mock';
import { SendYourNotificationsStrategy } from '../SendYourNotificationsStrategy';

describe('Mixpanel - Send Your Notification Strategy', () => {
  it('should return your notification strategy event', () => {
    const strategy = new SendYourNotificationsStrategy();

    const yourNotification = {
      notifications: [
        {
          iun: 'PDJL-WNLU-QEVX-202403-X-1',
          paProtocolNumber: '202403221213',
          sender: 'Comune di Sappada',
          sentAt: '2024-03-22T11:14:31.634488517Z',
          subject: 'test mixpanel',
          notificationStatus: NotificationStatus.VIEWED,
          recipients: ['LVLDAA85T50G702B'],
          requestAcceptedAt: '2024-03-22T11:17:40.361638886Z',
          group: '',
        },
      ],
      delegators: arrayOfDelegators,
      pagination: {
        nextPagesKey: [],
        size: 1,
        page: 1,
        moreResult: false,
      },
      domicileBannerType: 'EMAIL',
    };

    const yourNotificationEvent = strategy.performComputations(yourNotification);
    expect(yourNotificationEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.SCREEN_VIEW,
      ...(yourNotification.domicileBannerType && { banner: yourNotification.domicileBannerType }),
      delegate: yourNotification.delegators.length > 0,
      page_number: yourNotification.pagination.page,
      total_count: yourNotification.notifications.length,
      unread_count: yourNotification.notifications.filter((n) =>
        isNewNotification(n.notificationStatus)
      ).length,
      delivered_count: yourNotification.notifications.filter(
        (n) => n.notificationStatus === NotificationStatus.DELIVERED
      ).length,
      opened_count: yourNotification.notifications.filter(
        (n) => n.notificationStatus === NotificationStatus.VIEWED
      ).length,
      expired_count: yourNotification.notifications.filter(
        (n) => n.notificationStatus === NotificationStatus.EFFECTIVE_DATE
      ).length,
      not_found_count: yourNotification.notifications.filter(
        (n) => n.notificationStatus === NotificationStatus.UNREACHABLE
      ).length,
      cancelled_count: yourNotification.notifications.filter(
        (n) => n.notificationStatus === NotificationStatus.CANCELLED
      ).length,
    });
  });
});
