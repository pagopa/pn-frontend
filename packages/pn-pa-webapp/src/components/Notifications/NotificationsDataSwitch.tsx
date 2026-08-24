import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import {
  Notification,
  NotificationActionButton,
  NotificationColumnData,
  Row,
  StatusTooltip,
  formatDate,
  getNotificationStatusInfos,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

const NotificationStatusChip: React.FC<{ data: Row<Notification> }> = ({ data }) => {
  const { label, tooltip, color } = getNotificationStatusInfos(data.notificationStatus, {
    recipients: data.recipients,
  });
  return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
};

const NotificationsDataSwitch: React.FC<{
  data: Row<Notification>;
  type: keyof NotificationColumnData;
  handleRowClick?: (iun: string) => void;
}> = ({ data, type, handleRowClick }) => {
  const { t } = useTranslation(['notifiche']);
  const isMobile = useIsMobile();

  if (type === 'sentAt') {
    return isMobile ? (
      <Typography variant="body2" fontWeight={600}>
        {formatDate(data.sentAt)}
      </Typography>
    ) : (
      formatDate(data.sentAt)
    );
  }
  if (type === 'notificationStatus') {
    return <NotificationStatusChip data={data} />;
  }
  if (type === 'recipients') {
    return (
      <>
        {data.recipients.map((recipient) => (
          <Typography key={recipient} variant="body2" fontWeight={600}>
            {recipient}
          </Typography>
        ))}
      </>
    );
  }
  if (type === 'subject') {
    return isMobile ? (
      <Typography variant="body2" fontWeight={600}>
        {data.subject}
      </Typography>
    ) : (
      data.subject
    );
  }
  if (type === 'iun') {
    return isMobile ? (
      <Typography variant="body2" fontWeight={600}>
        {data.iun}
      </Typography>
    ) : (
      data.iun
    );
  }
  if (type === 'action') {
    return (
      <NotificationActionButton
        iun={data.iun}
        label={t('table.open')}
        onClick={() => handleRowClick?.(data.iun)}
      />
    );
  }

  return <></>;
};

export default NotificationsDataSwitch;
