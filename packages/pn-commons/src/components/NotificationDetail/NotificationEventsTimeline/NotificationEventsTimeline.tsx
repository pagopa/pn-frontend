import { Fragment, useMemo } from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';
import { MITimeline, MITimelineItem } from '@pagopa/mui-italia';

import { NotificationStatus } from '../../../models';
import { LegalFactId, NotificationDetailRecipient } from '../../../models/NotificationDetail';
import {
  NotificationTimelineEvent,
  NotificationTimelineStatusHistory,
} from '../../../models/NotificationTimeline';
import {
  emptyLegalFactPlan,
  getStatusLegalFactPlan,
  isTimelineGroupStep,
  toLegacyStatusHistory,
} from '../../../utility/notificationTimeline.utility';
import ReworkedStatusTag from '../ReworkedStatusTag';
import NotificationTimelineDescription from './NotificationTimelineDescription';
import NotificationTimelineEventItem from './NotificationTimelineEventItem';
import NotificationTimelineGroupItem from './NotificationTimelineGroupItem';
import { getMultiAttemptGroupIds } from './timelineGroupHeader.config';
import { getTimelineItems } from './timelineItem.config';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
  statusHistory: Array<NotificationTimelineStatusHistory>;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads?: boolean;
  isSenderTimeline?: boolean;
  language?: string;
  isNewTimelineCopyEnabled?: boolean;
};

const NotificationEventsTimeline = ({
  recipients,
  statusHistory,
  clickHandler,
  disableDownloads = false,
  isSenderTimeline,
  language = 'it',
  isNewTimelineCopyEnabled = false,
}: Props) => {
  const legacyStatusHistory = useMemo(() => toLegacyStatusHistory(statusHistory), [statusHistory]);
  const multiAttemptGroupIds = useMemo(
    () => getMultiAttemptGroupIds(statusHistory),
    [statusHistory]
  );
  const timelineItems = useMemo(
    () => getTimelineItems(statusHistory, legacyStatusHistory, recipients, isSenderTimeline),
    [statusHistory, legacyStatusHistory, recipients, isSenderTimeline, language]
  );

  return (
    <Box data-testid="NotificationEventsTimeline">
      <MITimeline>
        {timelineItems.map(
          ({ status, label, description, icon, variant, legacyStatus, recipientPerStep }) => {
            // Single decision point for the whole status: which legal fact goes inline in the
            // description and which events must therefore be skipped. The new copy is the only
            // mode that inlines legal facts, hence the flag is checked once, here.
            const plan = isNewTimelineCopyEnabled
              ? getStatusLegalFactPlan(legacyStatus, (event) => event.isHidden)
              : emptyLegalFactPlan<NotificationTimelineEvent>();

            // Absorbed events are dropped before rendering, so that no recipient header is
            // emitted for an event that will not be displayed. The original index is kept to
            // stay aligned with recipientPerStep.
            const visibleSteps = status.steps
              .map((step, stepIndex) => ({ step, stepIndex }))
              .filter(
                ({ step }) =>
                  isTimelineGroupStep(step) || !plan.hiddenEventIds.has(step.event.elementId)
              );

            return (
              <MITimelineItem
                key={`timeline_step_${status.status}_${status.activeFrom}`}
                icon={icon}
                variant={variant}
                title={
                  <Stack
                    component="span"
                    direction={{ xs: 'column-reverse', sm: 'row' }}
                    fontWeight={600}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    fontSize="16px"
                    gap={{ xs: 0.5, sm: 1 }}
                  >
                    {label}
                    <ReworkedStatusTag reworkedStatus={status.reworkedStatus} />
                  </Stack>
                }
              >
                <Stack gap={1.5} alignItems="flex-start">
                  {status.status !== NotificationStatus.DELIVERING && (
                    <NotificationTimelineDescription
                      description={description}
                      date={status.activeFrom}
                      language={language}
                      clickHandler={clickHandler}
                      slotProps={{
                        typography: { sx: { fontSize: '14px', fontWeight: 400 } },
                        button: { sx: { fontSize: '14px' } },
                      }}
                      disableDownloads={disableDownloads}
                      isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
                      legalFacts={plan.legalFacts.length === 1 ? plan.legalFacts : []}
                    />
                  )}

                  {visibleSteps.map(({ step, stepIndex }) => {
                    const recipient = recipientPerStep[stepIndex];
                    const recipientHeader = recipient && (
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        data-testid="timeline-group-recipient"
                        mt={2}
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
                            allEvents={legacyStatus.steps}
                            recipients={recipients}
                            clickHandler={clickHandler}
                            disableDownloads={disableDownloads}
                            language={language}
                            isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
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
                          allEvents={legacyStatus.steps}
                          recipients={recipients}
                          clickHandler={clickHandler}
                          disableDownloads={disableDownloads}
                          language={language}
                          hasMultipleAttempts={multiAttemptGroupIds.has(step.group.groupId)}
                          isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
                        />
                      </Fragment>
                    );
                  })}
                </Stack>
              </MITimelineItem>
            );
          }
        )}
      </MITimeline>
    </Box>
  );
};

export default NotificationEventsTimeline;
