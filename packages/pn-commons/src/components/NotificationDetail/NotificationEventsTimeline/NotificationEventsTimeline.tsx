import { Fragment, useMemo } from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';
import { MITimeline, MITimelineItem } from '@pagopa/mui-italia';

import { LegalFactId, NotificationDetailRecipient } from '../../../models/NotificationDetail';
import { NotificationTimelineStatusHistory } from '../../../models/NotificationTimeline';
import { getNotificationStatusInfos } from '../../../utility/notification.utility';
import {
  flattenTimelineSteps,
  isTimelineGroupStep,
  toLegacyStatusHistory,
} from '../../../utility/notificationTimeline.utility';
import ReworkedStatusTag from '../ReworkedStatusTag';
import NotificationTimelineEventDate from './NotificationTimelineEventDate';
import NotificationTimelineEventItem from './NotificationTimelineEventItem';
import NotificationTimelineGroupItem from './NotificationTimelineGroupItem';
import { getTimelineItemPresentation } from './notificationTimelineStatus.config';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
  statusHistory: Array<NotificationTimelineStatusHistory>;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads?: boolean;
  isParty?: boolean;
  language?: string;
};

const NotificationEventsTimeline = ({
  recipients,
  statusHistory,
  clickHandler,
  disableDownloads = false,
  isParty = true,
  language = 'it',
}: Props) => {
  const legacyStatusHistory = useMemo(() => toLegacyStatusHistory(statusHistory), [statusHistory]);

  return (
    <Box data-testid="NotificationEventsTimeline">
      <MITimeline>
        {statusHistory.map((status, index) => {
          const { label, description } = getNotificationStatusInfos(legacyStatusHistory[index], {
            statusHistory: legacyStatusHistory,
            recipients,
            isParty,
          });
          const { icon, variant } = getTimelineItemPresentation(status.status, index === 0);
          const allEvents = flattenTimelineSteps(status.steps);

          const hasGroupedEvents = status.steps.some(isTimelineGroupStep);

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
              <Stack gap={1} alignItems="flex-start">
                {!hasGroupedEvents && (
                  <Typography fontSize="14px" fontWeight={400}>
                    {description}{' '}
                    <NotificationTimelineEventDate date={status.activeFrom} language={language} />
                  </Typography>
                )}

                {status.steps.map((step, stepIndex) => {
                  if (!isTimelineGroupStep(step)) {
                    return (
                      <NotificationTimelineEventItem
                        event={step.event}
                        key={step.event.elementId}
                        allEvents={allEvents}
                        recipients={recipients}
                        clickHandler={clickHandler}
                        disableDownloads={disableDownloads}
                        language={language}
                      />
                    );
                  }

                  const previousStep = status.steps[stepIndex - 1];

                  return (
                    <Fragment key={step.group.groupId}>
                      {previousStep && isTimelineGroupStep(previousStep) && (
                        <Divider flexItem data-testid="timeline-group-divider" />
                      )}
                      <NotificationTimelineGroupItem
                        group={step.group}
                        allEvents={allEvents}
                        recipients={recipients}
                        clickHandler={clickHandler}
                        disableDownloads={disableDownloads}
                        language={language}
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
