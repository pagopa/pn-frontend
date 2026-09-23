import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { Stack, Typography } from '@mui/material';
import { MIButton, MIChip, MIPaper } from '@pagopa/mui-italia';

import {
  INotificationDetailTimeline,
  LegalFactId,
  NotificationDetailRecipient,
  NotificationStatusHistory,
} from '../../models';
import { getNotificationStatusInfos } from '../../utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import {
  emptyLegalFactPlan,
  getStatusLegalFactPlan,
} from '../../utility/notificationTimeline.utility';
import NotificationTimelineDescription from './NotificationEventsTimeline/NotificationTimelineDescription';

type NotificationTimelineBoxProps = {
  statusHistory: Array<NotificationStatusHistory>;
  recipients: Array<NotificationDetailRecipient>;
  isParty: boolean;
  onTimelineClick?: () => void;
  clickHandler: (legalFactId: LegalFactId) => void;
  isNewTimelineCopyEnabled?: boolean;
};

const NotificationTimelineBox: React.FC<NotificationTimelineBoxProps> = ({
  statusHistory,
  recipients,
  isParty,
  onTimelineClick,
  clickHandler,
  isNewTimelineCopyEnabled = false,
}) => {
  if (statusHistory.length === 0) {
    return null;
  }

  const notificationStatusInfos = getNotificationStatusInfos(statusHistory[0], {
    statusHistory,
    recipients,
    isParty,
  });

  const plan = isNewTimelineCopyEnabled
    ? getStatusLegalFactPlan(statusHistory[0], (event) => event.hidden)
    : emptyLegalFactPlan<INotificationDetailTimeline>();

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
        <NotificationTimelineDescription
          inlineLegalFact={plan.inlineLegalFact}
          description={notificationStatusInfos.description}
          clickHandler={clickHandler}
          slotProps={{ typography: { variant: 'body2' } }}
          isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
        />
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
