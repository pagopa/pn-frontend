import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { Box, Stack, Typography } from '@mui/material';
import { Tag } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks/useIsMobile';
import {
  NotificationColumnData,
  NotificationCommunicationType,
  RecipientNotification,
} from '../../models/Notifications';
import { Row } from '../../models/PnTable';
import { formatDate } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import DataValue from '../Data/DataValue';
import {
  MobileSentAtCell,
  NotificationActionButton,
  RecipientsCell,
} from './NotificationsDataSwitchCells';

const NewNotificationBadge: React.FC<{ isNew: boolean }> = ({ isNew }) =>
  isNew ? (
    <Box
      data-testid="new-notification-badge"
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        flexShrink: 0,
        mr: 1,
      }}
    />
  ) : null;

const NotificationsRecipientDataSwitch: React.FC<{
  data: Row<RecipientNotification>;
  type: keyof NotificationColumnData<RecipientNotification>;
  handleRowClick?: (
    iun: string,
    communicationType: NotificationCommunicationType,
    mandateId?: string
  ) => void;
}> = ({ data, type, handleRowClick }) => {
  const isMobile = useIsMobile();

  const isNewNotification = data.isNewNotification;

  if (type === 'sentAt' && !isMobile) {
    return (
      <Stack direction="row" alignItems="center">
        <NewNotificationBadge isNew={isNewNotification} />
        <DataValue
          mode="truncate"
          slots={{ root: Typography }}
          slotProps={{ root: { variant: 'body2' } }}
        >
          {formatDate(data.sentAt)}
        </DataValue>
      </Stack>
    );
  }
  if (type === 'sentAt' && isMobile) {
    return (
      <MobileSentAtCell
        date={data.sentAt}
        isNew={isNewNotification}
        badge={<NewNotificationBadge isNew={isNewNotification} />}
      />
    );
  }
  if (type === 'sender') {
    return data.sender;
  }
  if (type === 'subject') {
    return (
      <>
        <DataValue
          mode={isMobile ? 'wrap' : 'truncate'}
          slots={{ root: Typography }}
          slotProps={{ root: { variant: 'body2', mb: 0.5 } }}
        >
          {data.subject}
        </DataValue>
        {data.communicationType === 'LEGAL' && (
          <Tag
            variant="default"
            icon={VerifiedRoundedIcon}
            value={getLocalizedOrDefaultLabel('notifications', 'table.legal-value')}
          />
        )}
      </>
    );
  }
  if (type === 'iun') {
    return data.iun;
  }
  if (type === 'recipients') {
    return <RecipientsCell recipients={data.recipients} />;
  }
  if (type === 'action') {
    return (
      <NotificationActionButton
        iun={data.iun}
        label={getLocalizedOrDefaultLabel('notifications', 'table.open')}
        onClick={() => handleRowClick?.(data.iun, data.communicationType, data.mandateId)}
      />
    );
  }

  return <></>;
};

export default NotificationsRecipientDataSwitch;
