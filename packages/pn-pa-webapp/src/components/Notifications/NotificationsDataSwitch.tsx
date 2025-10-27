import { useTranslation } from 'react-i18next';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Typography } from '@mui/material';
import {
  CustomTagGroup,
  Notification,
  NotificationColumnData,
  Row,
  StatusTooltip,
  formatDate,
  getNotificationStatusInfos,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked, Tag, TagGroup } from '@pagopa/mui-italia';

const NotificationStatusChip: React.FC<{ data: Row<Notification> }> = ({ data }) => {
  const { label, tooltip, color } = getNotificationStatusInfos(data.notificationStatus, {
    recipients: data.recipients,
  });
  return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
};

const ActionButton: React.FC<{ iun: string; handleRowClick?: (iun: string) => void }> = ({
  iun,
  handleRowClick,
}) => {
  const { t } = useTranslation(['notifiche']);
  return (
    <ButtonNaked
      color="primary"
      data-testid="goToNotificationDetail"
      onClick={() => handleRowClick && handleRowClick(iun)}
      aria-label={t('table.aria-action-table', { iun })}
      endIcon={<ArrowForwardIosIcon />}
    >
      {t('table.show-detail')}
    </ButtonNaked>
  );
};

const NotificationsDataSwitch: React.FC<{
  data: Row<Notification>;
  type: keyof NotificationColumnData;
  handleRowClick?: (iun: string) => void;
}> = ({ data, type, handleRowClick }) => {
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
  if (type === 'action') {
    return <ActionButton iun={data.iun} handleRowClick={handleRowClick} />;
  }

  return <></>;
};

export default NotificationsDataSwitch;
