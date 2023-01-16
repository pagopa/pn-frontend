import { ReactNode } from 'react';
import { Badge } from '@mui/material';
import { NotificationStatus } from '@pagopa-pn/pn-commons';

const isNewNotification = (value: string) => {
  switch (value) {
    case NotificationStatus.VIEWED:
    case NotificationStatus.PAID:
    case NotificationStatus.CANCELLED:
      return false;
    default:
      return true;
  }
};

/**
 * Returns the current value for notification if the notification has already been viewed,
 * otherwise a blu dot badge followed by the current value
 * @param value
 * @returns
 */
export function getNewNotificationBadge(value: string): ReactNode {
  return isNewNotification(value) ? (
    <Badge
      data-testid="new-notification-badge"
      color="primary"
      variant="dot"
      sx={{ marginRight: '0px' }}
    />
  ) : null;
}
