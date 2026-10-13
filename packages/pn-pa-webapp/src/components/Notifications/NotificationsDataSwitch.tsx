import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import {
  CustomTagGroup,
  Notification,
  NotificationActionButton,
  NotificationColumnData,
  Row,
  StatusTooltip,
  formatDate,
  getNotificationStatusInfos,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { Tag, TagGroup } from '@pagopa/mui-italia';

const NotificationStatusChip: React.FC<{ data: Row<Notification> }> = ({ data }) => {
  const { label, tooltip, color } = getNotificationStatusInfos(data.notificationStatus, {
    recipients: data.recipients,
  });
  return <StatusTooltip label={label} tooltip={tooltip} color={color} />;
};

const NotificationGroup: React.FC<{
  data: Row<Notification>;
  isMobile: boolean;
}> = ({ data, isMobile }) => {
  if (!data.group) {
    return <></>;
  }

  return isMobile ? (
    <CustomTagGroup visibleItems={1}>
      {[
        <Box sx={{ mb: 1, mr: 1, display: 'inline-block', maxWidth: '100%' }} key={data.id}>
          <Tag value={data.group} mode="truncate" />
        </Box>,
      ]}
    </CustomTagGroup>
  ) : (
    <TagGroup visibleItems={4}>
      <Tag value={data.group} mode="truncate" />
    </TagGroup>
  );
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
          <Typography key={recipient} variant="body2" fontWeight={isMobile ? 600 : 400}>
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
  if (type === 'group') {
    return <NotificationGroup data={data} isMobile={isMobile} />;
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
