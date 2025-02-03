import { Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useIsMobile } from '../../hooks';
import { Notification, NotificationColumnData, Row } from '../../models';
import { formatDate, getNotificationStatusInfos } from '../../utility';
import NewNotificationBadge, { isNewNotification } from './NewNotificationBadge';
import StatusTooltip from './StatusTooltip';

const NotificationStatusChip: React.FC<{ data: Row<Notification> }> = ({ data }) => {
  const { label, tooltip, color } = getNotificationStatusInfos(data.notificationStatus, {
    recipients: data.recipients,
  });
  return <StatusTooltip label={label} tooltip={tooltip} color={color} />;
};

const SentAt: React.FC<{ data: Row<Notification>; isMobile: boolean }> = ({ data, isMobile }) => {
  if (!isMobile) {return <>{formatDate(data.sentAt)}</>;}

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
};

const Sender: React.FC<{ sender: string }> = ({ sender }) => <>{sender}</>;

const Subject: React.FC<{ subject: string }> = ({ subject }) => (
  <>{subject.length > 65 ? subject.substring(0, 65) + '...' : subject}</>
);

const Recipients: React.FC<{ recipients: Array<string> }> = ({ recipients }) => (
  <>
    {recipients.map((recipient) => (
      <Typography key={recipient} variant="body2">
        {recipient}
      </Typography>
    ))}
  </>
);

const ActionButton: React.FC<{ mandateId?: string; iun: string; handleRowClick: (iun: string, mandateId?: string) => void }> = ({
  mandateId,
  iun,
  handleRowClick,
}) => (
  <ButtonNaked onClick={() => handleRowClick(iun, mandateId)}>
    <ArrowForwardIosIcon color='primary' />
  </ButtonNaked>
);

const NotificationsDataSwitch: React.FC<{
  data: Row<Notification>;
  type: keyof NotificationColumnData;
  handleRowClick: (iun: string, mandateId?: string ) => void;
}> = ({ data, type, handleRowClick }) => {
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (type) {
      case 'badge':
        return <NewNotificationBadge status={data.notificationStatus} />;
      case 'sentAt':
        return <SentAt data={data} isMobile={isMobile} />;
      case 'sender':
        return <Sender sender={data.sender} />;
      case 'subject':
        return <Subject subject={data.subject} />;
      case 'iun':
        return <>{data.iun}</>;
      case 'notificationStatus':
        return <NotificationStatusChip data={data} />;
      case 'recipients':
        return <Recipients recipients={data.recipients} />;
      case 'action':
        return <ActionButton iun={data.iun} mandateId={data?.mandateId} handleRowClick={handleRowClick} />;
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

export default NotificationsDataSwitch;
