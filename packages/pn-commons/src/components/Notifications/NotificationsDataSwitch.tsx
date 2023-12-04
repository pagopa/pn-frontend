import { Typography } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { Notification, NotificationColumnData, Row } from '../../models';
import { formatDate, getNotificationStatusInfos } from '../../utility';
import NewNotificationBadge, { isNewNotification } from './NewNotificationBadge';
import StatusTooltip from './StatusTooltip';

const NotificationStatusChip: React.FC<{
  data: Row<Notification>;
}> = ({ data }) => {
  const { label, tooltip, color } = getNotificationStatusInfos(data.notificationStatus, {
    recipients: data.recipients,
  });
  return <StatusTooltip label={label} tooltip={tooltip} color={color} />;
};

const NotificationsDataSwitch: React.FC<{
  data: Row<Notification>;
  type: keyof NotificationColumnData;
}> = ({ data, type }) => {
  const isMobile = useIsMobile();

  if (type === 'badge') {
    return <NewNotificationBadge status={data.notificationStatus} />;
  }
  if (type === 'sentAt' && !isMobile) {
    return <>{formatDate(data.sentAt)}</>;
  }
  if (type === 'sentAt' && isMobile) {
    const newNotification = isNewNotification(data.notificationStatus);
    return newNotification ? (
      <>
        <Typography display="inline" sx={{ marginRight: '10px' }}>
          <NewNotificationBadge status={data.notificationStatus} />
        </Typography>
        <Typography display="inline" variant="body2">
          {formatDate(data.sentAt)}
        </Typography>
      </>
    ) : (
      <Typography variant="body2">{formatDate(data.sentAt)}</Typography>
    );
  }
  if (type === 'sender') {
    return <>{data.sender}</>;
  }
  if (type === 'subject') {
    return <>{data.subject.length > 65 ? data.subject.substring(0, 65) + '...' : data.subject}</>;
  }
  if (type === 'iun') {
    return <>{data.iun}</>;
  }
  if (type === 'notificationStatus') {
    return <NotificationStatusChip data={data} />;
  }
  if (type === 'recipients') {
    return (
      <>
        {data.recipients.map((recipient) => (
          <Typography key={recipient} variant="body2">
            {recipient}
          </Typography>
        ))}
      </>
    );
  }

  return <></>;
};

export default NotificationsDataSwitch;
