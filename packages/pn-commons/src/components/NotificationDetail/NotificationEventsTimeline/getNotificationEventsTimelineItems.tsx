import { ReactNode } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Stack, Typography } from '@mui/material';
import { ButtonNaked, MITimelineItemProps } from '@pagopa/mui-italia';

import {
  LegalFactId,
  NotificationDetailRecipient,
  NotificationStatusHistory,
  ReworkedStatus,
  TimelineCategory,
} from '../../../models/NotificationDetail';
import { NotificationStatus } from '../../../models/NotificationStatus';
import { formatDay, formatMonthString, formatTime } from '../../../utility/date.utility';
import {
  getLegalFactLabel,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
} from '../../../utility/notification.utility';
import ReworkedStatusTag from '../ReworkedStatusTag';
import {
  TimelineStatusPresentation,
  getTimelineStatusPresentation,
} from './notificationTimelineStatus.config';

type Props = {
  timelineStep: NotificationStatusHistory;
  statusHistory: Array<NotificationStatusHistory>;
  recipients: Array<NotificationDetailRecipient>;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads?: boolean;
  isFirst?: boolean;
  isParty?: boolean;
  language?: string;
};

export type NotificationEventsTimelineItem = Pick<
  MITimelineItemProps,
  'icon' | 'title' | 'variant'
> & {
  key: string;
  content?: ReactNode;
};

const TimelineItemTitle = ({
  title,
  reworkedStatus,
}: {
  title: string;
  reworkedStatus?: ReworkedStatus;
}) => (
  <Stack component="span" direction="row" alignItems="center" gap={1}>
    {title}
    <ReworkedStatusTag reworkedStatus={reworkedStatus} />
  </Stack>
);

const TimelineItemDate = ({
  date,
  language,
  testId,
}: {
  date: string;
  language: string;
  testId: 'dateItem' | 'dateItemMicro';
}) => (
  // Using a Box for a MUI italia problem
  <Box
    component="span"
    sx={{
      fontSize: '12px',
      color: 'text.secondary',
      fontWeight: 4000,
    }}
    data-testid={testId}
  >
    {formatTimelineDate(date, language)}
  </Box>
);

/**
 * Only the current macro-step (and the reworked one, wherever it sits) is colored:
 * every other step falls back to the neutral variant.
 */
const getTimelineVariant = (
  status: NotificationStatus,
  isFirst: boolean,
  variant: TimelineStatusPresentation['variant']
): MITimelineItemProps['variant'] =>
  isFirst || status === NotificationStatus.NOTIFICATION_TIMELINE_REWORKED ? variant : 'normal';

const formatTimelineDate = (date: string, language: string): string =>
  `${formatDay(date)} ${formatMonthString(date, language)}, ${formatTime(date)}`;

/**
 * Builds the flat list of items rendered directly by MITimeline.
 * Hidden micro-steps are rendered only when they contain legal facts.
 */
const getNotificationEventsTimelineItems = ({
  timelineStep,
  statusHistory,
  recipients,
  clickHandler,
  disableDownloads = false,
  isFirst = false,
  isParty = true,
  language = 'it',
}: Props): Array<NotificationEventsTimelineItem> => {
  const notificationStatusInfos = getNotificationStatusInfos(timelineStep, {
    statusHistory,
    recipients,
    isParty,
  });
  const statusPresentation = getTimelineStatusPresentation(timelineStep.status);

  const steps = timelineStep.steps ?? [];

  const macroStep: NotificationEventsTimelineItem = {
    key: `timeline_step_${timelineStep.status}_${timelineStep.activeFrom}`,
    title: (
      <TimelineItemTitle
        title={notificationStatusInfos.label}
        reworkedStatus={timelineStep.reworkedStatus}
      />
    ),
    icon: statusPresentation.icon,
    variant: getTimelineVariant(timelineStep.status, isFirst, statusPresentation.variant),
    content: (
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography color="text.primary" variant="caption">
          {notificationStatusInfos.description}{' '}
          <TimelineItemDate date={timelineStep.activeFrom} language={language} testId="dateItem" />
        </Typography>
      </Box>
    ),
  };

  const microSteps = steps.reduce<Array<NotificationEventsTimelineItem>>((items, step) => {
    if (step.hidden) {
      if (!step.legalFactsIds?.length) {
        return items;
      }

      return items.concat({
        key: step.elementId,
        variant: 'normal',
        icon: InfoOutlined,
        title: (
          <Stack component="span" alignItems="flex-start">
            {step.legalFactsIds.map((legalFact) => (
              <ButtonNaked
                key={legalFact.key}
                startIcon={<AttachFileIcon />}
                onClick={() => clickHandler(legalFact)}
                color="primary"
                sx={{ textAlign: 'left' }}
                data-testid="download-legalfact-micro"
                disabled={
                  step.category !== TimelineCategory.NOTIFICATION_CANCELLED && disableDownloads
                }
              >
                {getLegalFactLabel(step, legalFact.category, legalFact.key || '')}
              </ButtonNaked>
            ))}
          </Stack>
        ),
      });
    }

    const timelineStatusInfos = getNotificationTimelineStatusInfos(step, recipients, steps);
    if (!timelineStatusInfos) {
      return items;
    }

    return items.concat({
      key: step.elementId,
      variant: 'normal',
      title: (
        <TimelineItemTitle title={timelineStatusInfos.label} reworkedStatus={step.reworkedStatus} />
      ),
      icon: InfoOutlined,
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowWrap: 'anywhere' }}>
          <Typography color="text.primary" variant="caption">
            {timelineStatusInfos.description}{' '}
            <TimelineItemDate date={step.timestamp} language={language} testId="dateItemMicro" />
          </Typography>
          {step.legalFactsIds?.map((legalFact) => (
            <ButtonNaked
              fontSize={14}
              color="primary"
              onClick={() => clickHandler(legalFact)}
              disabled={disableDownloads}
              key={legalFact.key}
              data-testid="download-legalfact-micro"
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
              }}
            >
              {getLegalFactLabel(step, legalFact.category, legalFact.key || '')}
            </ButtonNaked>
          ))}
        </Box>
      ),
    });
  }, []);

  return [macroStep, ...microSteps];
};

export default getNotificationEventsTimelineItems;
