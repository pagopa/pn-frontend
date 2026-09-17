import { Stack, Typography } from '@mui/material';

import { LegalFactId, NotificationDetailRecipient } from '../../../models/NotificationDetail';
import { NotificationTimelineEvent } from '../../../models/NotificationTimeline';
import { getNotificationTimelineStatusInfos } from '../../../utility/notification.utility';
import { statusHasStepsToShow } from '../../../utility/notificationTimeline.utility';
import ReworkedStatusTag from '../ReworkedStatusTag';
import NotificationTimelineEventDate from './NotificationTimelineEventDate';
import NotificationTimelineEventDescription from './NotificationTimelineEventDescription';
import TimelineLegalFacts from './TimelineLegalFacts';

type Props = {
  event: NotificationTimelineEvent;
  allEvents: Array<NotificationTimelineEvent>;
  recipients: Array<NotificationDetailRecipient>;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads: boolean;
  language: string;
  asBullet?: boolean;
  isNewTimelineCopyEnabled?: boolean;
};

const NotificationTimelineEventItemLegalFacts: React.FC<
  Pick<Props, 'event' | 'clickHandler' | 'disableDownloads' | 'asBullet'>
> = ({ event, clickHandler, disableDownloads, asBullet }) => {
  if (!event.legalFactsIds?.length) {
    return null;
  }

  const legalFacts = (
    <TimelineLegalFacts
      event={event}
      clickHandler={clickHandler}
      disableDownloads={disableDownloads}
      withIcon
      testId={asBullet ? 'download-legalfact-micro' : 'download-legalfact'}
    />
  );

  // asBullet is true when the legal fact is in a group,
  // otherwise it is under the notification status
  return asBullet ? (
    <Stack component="li" sx={{ display: 'list-item' }}>
      {legalFacts}
    </Stack>
  ) : (
    legalFacts
  );
};

const NotificationTimelineEventItem: React.FC<Props> = ({
  event,
  allEvents,
  recipients,
  clickHandler,
  disableDownloads,
  language,
  asBullet = false,
  isNewTimelineCopyEnabled = false,
}) => {
  if (!statusHasStepsToShow(allEvents) && isNewTimelineCopyEnabled) {
    return null;
  }
  if (event.isHidden && !isNewTimelineCopyEnabled) {
    return (
      <NotificationTimelineEventItemLegalFacts
        event={event}
        asBullet={asBullet}
        disableDownloads={disableDownloads}
        clickHandler={clickHandler}
      />
    );
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
        <NotificationTimelineEventDescription
          description={statusInfo.description}
          legalFactsIds={event.legalFactsIds ?? []}
          clickHandler={clickHandler}
        />
        <NotificationTimelineEventDate date={event.timestamp} language={language} />
      </Typography>

      {!isNewTimelineCopyEnabled && (
        <TimelineLegalFacts
          event={event}
          clickHandler={clickHandler}
          disableDownloads={disableDownloads}
        />
      )}
    </Stack>
  );
};

export default NotificationTimelineEventItem;
