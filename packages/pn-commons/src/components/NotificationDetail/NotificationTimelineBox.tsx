import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { IconButton, Stack, Typography } from '@mui/material';
import { MIChip, MIPaper } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import { NotificationDetailRecipient, NotificationStatusHistory } from '../../models';
import { getNotificationStatusInfos } from '../../utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

type NotificationTimelineBoxProps = {
  statusHistory: Array<NotificationStatusHistory>;
  recipients: Array<NotificationDetailRecipient>;
  isParty: boolean;
};

const NotificationTimelineBox = ({
  statusHistory,
  recipients,
  isParty,
}: NotificationTimelineBoxProps) => {
  const isMobile = useIsMobile('sm');

  const notificationStatusInfos = getNotificationStatusInfos(statusHistory[0], {
    statusHistory,
    recipients,
    isParty,
  });

  return (
    <MIPaper padding={24}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
        <Stack width="85%">
          <Typography component="h2" variant="h5" sx={{ mb: 1 }}>
            {getLocalizedOrDefaultLabel(
              'notifications',
              'detail.notification-timeline-section.title'
            )}
          </Typography>
          <MIChip
            color={statusHistory[0].status === 'CANCELLED' ? 'warning' : 'success'}
            variant="filled"
            label={notificationStatusInfos.label}
            sx={{ my: 1, width: 'fit-content' }}
          />
          {!isMobile && (
            <Typography variant="body2">{notificationStatusInfos.description}</Typography>
          )}
        </Stack>
        <IconButton
          size="small"
          aria-label={getLocalizedOrDefaultLabel(
            'notifications',
            'detail.notification-timeline-section.aria-label'
          )}
          onClick={() => {}}
        >
          <KeyboardArrowRightRoundedIcon />
        </IconButton>
      </Stack>
    </MIPaper>
  );
};

export default NotificationTimelineBox;
