import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { formatDate } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

/**
 * Shared presentational cells used by the notifications data switches
 * (NotificationsDataSwitch / NotificationsRecipientDataSwitch).
 * They cover the rendering that is identical across notification models,
 * so each switch can stay a thin dispatcher.
 */

export const RecipientsCell: React.FC<{ recipients: Array<string> }> = ({ recipients }) => (
  <>
    {recipients.map((recipient) => (
      <Typography key={recipient} variant="body2">
        {recipient}
      </Typography>
    ))}
  </>
);

export const MobileSentAtCell: React.FC<{
  date: string;
  isNew: boolean;
  badge: React.ReactNode;
}> = ({ date, isNew, badge }) =>
  isNew ? (
    <>
      <Typography display="inline" sx={{ marginRight: '10px' }}>
        {badge}
      </Typography>
      <Typography display="inline" variant="body2">
        {formatDate(date)}
      </Typography>
    </>
  ) : (
    <Typography variant="body2">{formatDate(date)}</Typography>
  );

export const NotificationActionButton: React.FC<{
  iun: string;
  label: string;
  onClick?: () => void;
}> = ({ iun, label, onClick }) => (
  <ButtonNaked
    color="primary"
    data-testid="goToNotificationDetail"
    onClick={onClick}
    endIcon={<ArrowForwardIosIcon />}
    aria-label={getLocalizedOrDefaultLabel('notifications', 'table.aria-action-table', undefined, {
      iun,
    })}
  >
    {label}
  </ButtonNaked>
);
