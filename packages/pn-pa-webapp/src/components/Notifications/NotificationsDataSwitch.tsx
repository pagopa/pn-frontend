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
import { ButtonNaked, Tag, TagGroup } from '@pagopa/mui-italia';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NotificationColumnData } from '@pagopa-pn/pn-commons/src/models/Notifications';
import { useTranslation } from 'react-i18next';

const NotificationStatusChip: React.FC<{ data: Row<Notification> }> = ({ data }) => {
  const { label, tooltip, color } = getNotificationStatusInfos(data.notificationStatus, {
    recipients: data.recipients,
  });
  return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
};

const Recipients: React.FC<{ recipients: Array<string> }> = ({ recipients }) => (
  <>
    {recipients.map((recipient) => (
      <Typography
        key={recipient}
        variant="body2"
        sx={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          color: 'inherit',
        }}
      >
        {recipient}
      </Typography>
    ))}
  </>
);

const Subject: React.FC<{ subject: string }> = ({ subject }) => (
  <Box
    sx={{
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color: 'inherit',
    }}
  >
    {subject}
  </Box>
);

const GroupTag: React.FC<{ group: string | undefined; isMobile: boolean }> = ({
  group,
  isMobile,
}) =>
  group && isMobile ? (
    <CustomTagGroup visibleItems={1}>
      <Box sx={{ mb: 1, mr: 1, display: 'inline-block' }}>
        <Tag value={group} />
      </Box>
    </CustomTagGroup>
  ) : group && !isMobile ? (
    <TagGroup visibleItems={4}>
      <Tag value={group} />
    </TagGroup>
  ) : (
    <></>
  );

const ActionButton: React.FC<{ iun: string; handleRowClick?: (iun: string) => void }> = ({
  iun,
  handleRowClick,
}) => {
  const { t } = useTranslation(['notifiche']);
  return (
    <ButtonNaked
      data-testid="goToNotificationDetail"
      onClick={() => handleRowClick && handleRowClick(iun)}
      aria-label={t('table.aria-action-table', { iun })}
    >
      <ChevronRightIcon color="primary" />
    </ButtonNaked>
  );
};

const NotificationsDataSwitch: React.FC<{
  data: Row<Notification>;
  type: keyof NotificationColumnData;
  handleRowClick?: (iun: string) => void;
}> = ({ data, type, handleRowClick }) => {
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (type) {
      case 'sentAt':
        return <>{formatDate(data.sentAt)}</>;
      case 'notificationStatus':
        return <NotificationStatusChip data={data} />;
      case 'recipients':
        return <Recipients recipients={data.recipients} />;
      case 'subject':
        return <Subject subject={data.subject} />;
      case 'iun':
        return <>{data.iun}</>;
      case 'group':
        return <GroupTag group={data.group} isMobile={isMobile} />;
      case 'action':
        return <ActionButton iun={data.iun} handleRowClick={handleRowClick} />;
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

export default NotificationsDataSwitch;
