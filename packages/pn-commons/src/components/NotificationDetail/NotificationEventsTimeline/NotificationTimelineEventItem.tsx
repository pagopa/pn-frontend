import { Stack, Typography } from '@mui/material';

import { LegalFactId, NotificationDetailRecipient } from '../../../models/NotificationDetail';
import { NotificationTimelineEvent } from '../../../models/NotificationTimeline';
import { getNotificationTimelineStatusInfos } from '../../../utility/notification.utility';
import ReworkedStatusTag from '../ReworkedStatusTag';
import NotificationTimelineEventDate from './NotificationTimelineEventDate';
import TimelineLegalFacts from './TimelineLegalFacts';

type Props = {
  event: NotificationTimelineEvent;
  allEvents: Array<NotificationTimelineEvent>;
  recipients: Array<NotificationDetailRecipient>;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads: boolean;
  language: string;
  asBullet?: boolean;
};

const NotificationTimelineEventItem = ({
  event,
  allEvents,
  recipients,
  clickHandler,
  disableDownloads,
  language,
  asBullet = false,
}: Props) => {
  if (event.isHidden) {
    return event.legalFactsIds?.length ? (
      <TimelineLegalFacts
        event={event}
        clickHandler={clickHandler}
        disableDownloads={disableDownloads}
        withIcon
        testId={asBullet ? 'download-legalfact-micro' : 'download-legalfact'}
      />
    ) : null;
  }

  const statusInfo = getNotificationTimelineStatusInfos(event, recipients, allEvents);

  if (!statusInfo) {
    return null;
  }

  return (
    <Stack
      component={asBullet ? 'li' : 'div'}
      spacing={0.5}
      sx={{ overflowWrap: 'anywhere', display: asBullet ? 'list-item' : 'flex', py: 1 }}
      data-testid="timeline-event"
    >
      <Stack component="span" direction="row" alignItems="center" gap={1}>
        {!asBullet && statusInfo.label}
        <ReworkedStatusTag reworkedStatus={event.reworkedStatus} />
      </Stack>

      <Typography variant="body2" fontWeight={400}>
        {asBullet && (
          <>
            <Typography component="span" variant="body2" fontWeight={600}>
              {statusInfo.label}
            </Typography>
            {' - '}
          </>
        )}
        {statusInfo.description}{' '}
        <NotificationTimelineEventDate date={event.timestamp} language={language} />
      </Typography>

      <TimelineLegalFacts
        event={event}
        clickHandler={clickHandler}
        disableDownloads={disableDownloads}
      />
    </Stack>
  );
};

export default NotificationTimelineEventItem;
