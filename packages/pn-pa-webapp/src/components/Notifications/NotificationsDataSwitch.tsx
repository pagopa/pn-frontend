import { Box, Typography } from '@mui/material';
import {
  CustomTagGroup,
  Notification,
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
  return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
};

const NotificationsDataSwitch: React.FC<{ data: Row<Notification>; type: keyof Notification }> = ({
  data,
  type,
}) => {
  const isMobile = useIsMobile();

  if (type === 'sentAt') {
    return <>{formatDate(data.sentAt)}</>;
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
    return <>{data.subject.length > 65 ? data.subject.substring(0, 65) + '...' : data.subject}</>;
  }
  if (type === 'iun') {
    return <>{data.iun}</>;
  }
  if (type === 'group' && isMobile) {
    return data.group ? (
      <CustomTagGroup visibleItems={1}>
        {[
          <Box sx={{ mb: 1, mr: 1, display: 'inline-block' }} key={data.id}>
            <Tag value={data.group} />
          </Box>,
        ]}
      </CustomTagGroup>
    ) : (
      <></>
    );
  }
  if (type === 'group' && !isMobile) {
    return data.group ? (
      <TagGroup visibleItems={4}>
        <Tag value={data.group} />
      </TagGroup>
    ) : (
      <></>
    );
  }

  return <></>;
};

export default NotificationsDataSwitch;
