import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks/useIsMobile';
import { Notification, NotificationColumnData } from '../../models/Notifications';
import { Row } from '../../models/PnTable';
import { formatDate } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import { getNotificationStatusInfos } from '../../utility/notification.utility';
import NewNotificationBadge, { isNewNotification } from './NewNotificationBadge';
import StatusTooltip from './StatusTooltip';

const NotificationStatusChip: React.FC<{ data: Row<Notification> }> = ({ data }) => {
  const { label, tooltip, color } = getNotificationStatusInfos(data.notificationStatus, {
    recipients: data.recipients,
  });
  return <StatusTooltip label={label} tooltip={tooltip} color={color} />;
};

const ActionButton: React.FC<{
  mandateId?: string;
  iun: string;
  handleRowClick?: (iun: string, mandateId?: string) => void;
}> = ({ mandateId, iun, handleRowClick }) => (
  <ButtonNaked
    color="primary"
    data-testid="goToNotificationDetail"
    onClick={() => handleRowClick && handleRowClick(iun, mandateId)}
    endIcon={<ArrowForwardIosIcon />}
    aria-label={getLocalizedOrDefaultLabel('notifications', 'table.aria-action-table', undefined, {
      iun,
    })}
  >
    {getLocalizedOrDefaultLabel('notifications', 'table.show-detail')}
  </ButtonNaked>
);

const NotificationsDataSwitch: React.FC<{
  data: Row<Notification>;
  type: keyof NotificationColumnData;
  handleRowClick?: (iun: string, mandateId?: string) => void;
}> = ({ data, type, handleRowClick }) => {
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
    return (
      <Box
        sx={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          color: 'inherit',
        }}
      >
        {data.subject}
      </Box>
    );
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
  if (type === 'action') {
    return (
      <ActionButton iun={data.iun} mandateId={data?.mandateId} handleRowClick={handleRowClick} />
    );
  }

  return <></>;
};

export default NotificationsDataSwitch;
