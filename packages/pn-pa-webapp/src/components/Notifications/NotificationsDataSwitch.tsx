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

  if (type === 'sentAt') {
    return formatDate(data.sentAt);
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
  if (type === 'subject') {
    return data.subject;
  }
  if (type === 'iun') {
    return data.iun;
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
