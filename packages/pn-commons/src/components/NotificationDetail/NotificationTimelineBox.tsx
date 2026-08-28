import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { Stack, Typography } from '@mui/material';
import { MIButton, MIChip, MIPaper } from '@pagopa/mui-italia';

import { NotificationDetailRecipient, NotificationStatusHistory } from '../../models';
import { getNotificationStatusInfos } from '../../utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

type NotificationTimelineBoxProps = {
  statusHistory: Array<NotificationStatusHistory>;
  recipients: Array<NotificationDetailRecipient>;
  isParty: boolean;
  onTimelineClick?: () => void;
};

const NotificationTimelineBox = ({
  statusHistory,
  recipients,
  isParty,
  onTimelineClick,
}: NotificationTimelineBoxProps) => {
  if (statusHistory.length === 0) {
    return null;
  }

  const notificationStatusInfos = getNotificationStatusInfos(statusHistory[0], {
    statusHistory,
    recipients,
    isParty,
  });

  return (
    <MIPaper padding={24} data-testid="NotificationDetailTimeline">
      <Stack spacing={1} alignItems="flex-start">
        <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
          {getLocalizedOrDefaultLabel(
            'notifications',
            'detail.notification-timeline-section.title'
          )}
        </Typography>
        <MIChip
          color={notificationStatusInfos.color}
          variant="filled"
          label={notificationStatusInfos.label}
          sx={{ my: 1, width: 'fit-content' }}
        />
        <Typography variant="body2">{notificationStatusInfos.description}</Typography>
        <MIButton
          aria-label={getLocalizedOrDefaultLabel(
            'notifications',
            'detail.notification-timeline-section.aria-label'
          )}
          onClick={onTimelineClick}
          variant="text"
        >
          {getLocalizedOrDefaultLabel('notifications', 'go-to-detail')}{' '}
          <KeyboardArrowRightRoundedIcon />
        </MIButton>
      </Stack>
    </MIPaper>
  );
};

export default NotificationTimelineBox;
