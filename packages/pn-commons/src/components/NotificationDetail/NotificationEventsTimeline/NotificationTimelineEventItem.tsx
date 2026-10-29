import { Box, Stack } from '@mui/material';

import {
  LegalFactId,
  NotificationDetailRecipient,
  TimelineCategory,
} from '../../../models/NotificationDetail';
import { NotificationTimelineEvent } from '../../../models/NotificationTimeline';
import {
  getLegalFactLabel,
  getNotificationTimelineStatusInfos,
} from '../../../utility/notification.utility';
import ReworkedStatusTag from '../ReworkedStatusTag';
import NotificationTimelineDescription, {
  NotificationTimelineEventLegalFact,
  isLegalFactDownloadDisabled,
} from './NotificationTimelineDescription';
import TimelineLegalFacts from './TimelineLegalFacts';
import { PERFECTION_ANCHORS } from './timelineItem.config';

type Props = {
  event: NotificationTimelineEvent;
  allEvents: Array<NotificationTimelineEvent>;
  recipients: Array<NotificationDetailRecipient>;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads: boolean;
  language: string;
  insideAGroup?: boolean;
  isNewTimelineCopyEnabled?: boolean;
  perfectionLink?: string;
  delegatorName?: string;
};

const NotificationTimelineEventItemLegalFacts: React.FC<
  Pick<Props, 'event' | 'clickHandler' | 'disableDownloads' | 'insideAGroup'>
> = ({ event, clickHandler, disableDownloads, insideAGroup }) => {
  if (!event.legalFactsIds?.length) {
    return null;
  }

  const legalFacts = (
    <TimelineLegalFacts
      event={event}
      clickHandler={clickHandler}
      disableDownloads={disableDownloads}
      withIcon
      testId={insideAGroup ? 'download-legalfact-micro' : 'download-legalfact'}
    />
  );

  // insideAGroup is true when the legal fact is in a group,
  // otherwise it is under the notification status
  return insideAGroup ? (
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
  insideAGroup = false,
  isNewTimelineCopyEnabled = false,
  perfectionLink,
  delegatorName,
}) => {
  // Events absorbed into a status description are filtered out by the caller, so reaching
  // this component means the event has to be rendered.
  if (event.isHidden && !isNewTimelineCopyEnabled) {
    return (
      <NotificationTimelineEventItemLegalFacts
        event={event}
        insideAGroup={insideAGroup}
        disableDownloads={disableDownloads}
        clickHandler={clickHandler}
      />
    );
  }

  const statusInfo = getNotificationTimelineStatusInfos(
    event,
    recipients,
    allEvents,
    isNewTimelineCopyEnabled,
    delegatorName
  );

  if (!statusInfo) {
    return null;
  }

  // Event level mirrors the status rule: a single legal fact is inlined in the description
  // text, several ones are listed below it. Inlining only happens with the new copy.
  const eventLegalFacts = (event.legalFactsIds ?? []).map((lf) => ({ event, lf }));
  const isLegalFactInlined = isNewTimelineCopyEnabled && eventLegalFacts.length === 1;

  // Outside a group (which is already a list) the listed legal facts are rendered as events,
  // each one with its own bullet. Inside a group they stay below the event description.
  const listedLegalFacts = insideAGroup || isLegalFactInlined ? [] : eventLegalFacts;

  const eventPerfectionLink =
    isNewTimelineCopyEnabled &&
    perfectionLink &&
    event.category === TimelineCategory.ANALOG_FAILURE_WORKFLOW
      ? `${perfectionLink}${PERFECTION_ANCHORS.ANALOG}`
      : perfectionLink;

  const eventItem = (
    <Stack
      component="li"
      spacing={0.5}
      sx={{ overflowWrap: 'anywhere', display: 'list-item', py: 1 }}
      data-testid="timeline-event"
    >
      <Stack component="span" direction="row" alignItems="center" gap={1}>
        <ReworkedStatusTag reworkedStatus={event.reworkedStatus} />
      </Stack>

      <NotificationTimelineDescription
        title={statusInfo.label}
        description={statusInfo.description}
        date={event.timestamp}
        language={language}
        event={event}
        legalFacts={insideAGroup || isLegalFactInlined ? eventLegalFacts : []}
        clickHandler={clickHandler}
        slotProps={{ typography: { variant: 'body2', sx: { fontWeight: 400 } } }}
        isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
        disableDownloads={disableDownloads}
        perfectionLink={eventPerfectionLink}
      />
    </Stack>
  );

  if (insideAGroup) {
    return eventItem;
  }

  return (
    <Box component="ul" sx={{ listStyleType: 'disc', pl: 3, m: 0 }}>
      {eventItem}
      {listedLegalFacts.map(({ lf }) => (
        <Stack component="li" key={lf.key} sx={{ display: 'list-item', py: 1 }}>
          <NotificationTimelineEventLegalFact
            legalFact={lf}
            clickHandler={clickHandler}
            disableDownloads={isLegalFactDownloadDisabled(event.category, disableDownloads)}
            dataTestId="download-legalfact-micro"
            isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
          >
            {getLegalFactLabel(event, lf.category, lf.key || '')}
          </NotificationTimelineEventLegalFact>
        </Stack>
      ))}
    </Box>
  );
};

export default NotificationTimelineEventItem;
