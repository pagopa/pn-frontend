import { ArrowForwardRounded } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { MIButton } from '@pagopa/mui-italia';

import { formatDate } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import DataValue from '../Data/DataValue';

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
}> = ({ date, isNew, badge }) => (
  <Stack direction="row" alignItems="center">
    {!!isNew && badge}
    <DataValue
      mode="truncate"
      slots={{ root: Typography }}
      slotProps={{ root: { variant: 'body2', fontWeight: 600 } }}
    >
      {formatDate(date)}
    </DataValue>
  </Stack>
);

export const NotificationActionButton: React.FC<{
  iun: string;
  label: string;
  onClick?: () => void;
}> = ({ iun, label, onClick }) => (
  <MIButton
    variant="text"
    data-testid="goToNotificationDetail"
    onClick={onClick}
    endIcon={<ArrowForwardRounded />}
    aria-label={getLocalizedOrDefaultLabel('notifications', 'table.aria-action-table', undefined, {
      iun,
    })}
  >
    {label}
  </MIButton>
);
