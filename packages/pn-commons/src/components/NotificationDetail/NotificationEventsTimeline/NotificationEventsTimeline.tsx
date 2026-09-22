import { Fragment, useMemo } from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';
import { MITimeline, MITimelineItem } from '@pagopa/mui-italia';

import { NotificationStatus } from '../../../models';
import { LegalFactId, NotificationDetailRecipient } from '../../../models/NotificationDetail';
import { NotificationTimelineStatusHistory } from '../../../models/NotificationTimeline';
import {
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
          ({ status, label, description, icon, variant, legacyStatus, recipientPerStep }) => (
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
                    status={legacyStatus}
                    clickHandler={clickHandler}
                    slotProps={{
                      typography: { sx: { fontSize: '14px', fontWeight: 400 } },
                      button: { sx: { fontSize: '14px' } },
                    }}
                    disableDownloads={disableDownloads}
                    isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
                  />
                )}

                {status.steps.map((step, stepIndex) => {
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
                          status={status}
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
                        status={status}
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
          )
        )}
      </MITimeline>
    </Box>
  );
};

export default NotificationEventsTimeline;
