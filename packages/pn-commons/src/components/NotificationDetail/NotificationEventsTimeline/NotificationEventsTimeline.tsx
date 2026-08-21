import { Fragment, useMemo } from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';
import { MITimeline, MITimelineItem } from '@pagopa/mui-italia';

import { LegalFactId, NotificationDetailRecipient } from '../../../models/NotificationDetail';
import { NotificationTimelineStatusHistory } from '../../../models/NotificationTimeline';
import { getNotificationStatusInfos } from '../../../utility/notification.utility';
import {
  flattenTimelineSteps,
  getRecipientPerStep,
  isTimelineGroupStep,
  toLegacyStatusHistory,
} from '../../../utility/notificationTimeline.utility';
import ReworkedStatusTag from '../ReworkedStatusTag';
import NotificationTimelineEventDate from './NotificationTimelineEventDate';
import NotificationTimelineEventItem from './NotificationTimelineEventItem';
import NotificationTimelineGroupItem from './NotificationTimelineGroupItem';
import { getTimelineItemPresentation } from './notificationTimelineStatus.config';
import { getMultiAttemptGroupIds } from './timelineGroupHeader.config';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
  statusHistory: Array<NotificationTimelineStatusHistory>;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads?: boolean;
  isSenderTimeline?: boolean;
  language?: string;
};

const NotificationEventsTimeline = ({
  recipients,
  statusHistory,
  clickHandler,
  disableDownloads = false,
  isSenderTimeline,
  language = 'it',
}: Props) => {
  const legacyStatusHistory = useMemo(() => toLegacyStatusHistory(statusHistory), [statusHistory]);
  const multiAttemptGroupIds = useMemo(
    () => getMultiAttemptGroupIds(statusHistory),
    [statusHistory]
  );
  const isMultiRecipient = recipients.length > 1;

  return (
    <Box data-testid="NotificationEventsTimeline">
      <MITimeline>
        {statusHistory.map((status, index) => {
          const { label, description } = getNotificationStatusInfos(legacyStatusHistory[index], {
            statusHistory: legacyStatusHistory,
            recipients,
            isParty: isSenderTimeline,
          });
          const { icon, variant } = getTimelineItemPresentation(status.status, index === 0);
          const allEvents = flattenTimelineSteps(status.steps);

          const hasGroupedEvents = status.steps.some(isTimelineGroupStep);

          const recipientPerStep =
            isMultiRecipient && isSenderTimeline
              ? getRecipientPerStep(status.steps, recipients)
              : [];

          return (
            <MITimelineItem
              key={`timeline_step_${status.status}_${status.activeFrom}`}
              icon={icon}
              variant={variant}
              title={
                <Stack
                  component="span"
                  direction="row"
                  fontWeight={600}
                  alignItems="center"
                  fontSize="16px"
                  gap={1}
                >
                  {label}
                  <ReworkedStatusTag reworkedStatus={status.reworkedStatus} />
                </Stack>
              }
            >
              <Stack gap={1.5} alignItems="flex-start" mt={hasGroupedEvents ? 1.5 : 0}>
                {!hasGroupedEvents && (
                  <Typography fontSize="14px" fontWeight={400}>
                    {description}{' '}
                    <NotificationTimelineEventDate date={status.activeFrom} language={language} />
                  </Typography>
                )}

                {status.steps.map((step, stepIndex) => {
                  const recipient = recipientPerStep[stepIndex];
                  const recipientHeader = recipient && (
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      data-testid="timeline-group-recipient"
                      mt={3}
                      sx={{ color: '#555C70' }}
                    >
                      {`${recipient.denomination} - ${recipient.taxId}`}
                    </Typography>
                  );

                  if (!isTimelineGroupStep(step)) {
                    return (
                      <Fragment key={step.event.elementId}>
                        {recipientHeader}
                        <NotificationTimelineEventItem
                          event={step.event}
                          allEvents={allEvents}
                          recipients={recipients}
                          clickHandler={clickHandler}
                          disableDownloads={disableDownloads}
                          language={language}
                        />
                      </Fragment>
                    );
                  }

                  const previousStep = status.steps[stepIndex - 1];
                  const hasPreviousGroup = !!previousStep && isTimelineGroupStep(previousStep);

                  return (
                    <Fragment key={step.group.groupId}>
                      {hasPreviousGroup && (
                        <Divider flexItem data-testid="timeline-group-divider" />
                      )}

                      {recipientHeader}

                      <NotificationTimelineGroupItem
                        group={step.group}
                        allEvents={allEvents}
                        recipients={recipients}
                        clickHandler={clickHandler}
                        disableDownloads={disableDownloads}
                        language={language}
                        hasMultipleAttempts={multiAttemptGroupIds.has(step.group.groupId)}
                      />
                    </Fragment>
                  );
                })}
              </Stack>
            </MITimelineItem>
          );
        })}
      </MITimeline>
    </Box>
  );
};

export default NotificationEventsTimeline;
