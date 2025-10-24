import { Badge } from '@mui/material';

import { NotificationStatus } from '../../models/NotificationStatus';

export const isNewNotification = (value: NotificationStatus) => {
  switch (value) {
    case NotificationStatus.VIEWED:
    case NotificationStatus.PAID:
    case NotificationStatus.CANCELLED:
    case NotificationStatus.RETURNED_TO_SENDER:
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
const NewNotificationBadge: React.FC<{ status: NotificationStatus }> = ({ status }) => {
  if (isNewNotification(status)) {
    return (
      <Badge data-testid="new-notification-badge" color="primary" variant="dot" sx={{ ml: 0.5 }} />
    );
  }
  return <></>;
};

export default NewNotificationBadge;
