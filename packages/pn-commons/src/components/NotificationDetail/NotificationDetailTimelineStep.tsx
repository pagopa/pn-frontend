import { useState, Fragment, ReactNode } from 'react';
import { Typography, Chip, Box, Button } from '@mui/material';
import { TimelineConnector } from '@mui/lab';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import {
  TimelineNotificationItem,
  TimelineNotificationOppositeContent,
  TimelineNotificationContent,
  TimelineNotificationDot,
  TimelineNotificationSeparator,
  ButtonNaked,
} from '@pagopa/mui-italia';

import { getDay, getMonthString, getTime } from '../../utils/date.utility';
import {
  getLegalFactLabel,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
} from '../../utils/notification.utility';
import {
  LegalFactId,
  INotificationDetailTimeline,
  NotificationDetailRecipient,
  NotificationStatusHistory,
  TimelineCategory,
} from '../../types/NotificationDetail';

type Props = {
  timelineStep: NotificationStatusHistory;
  recipients: Array<NotificationDetailRecipient>;
  legalFactLabels: { attestation: string; receipt: string };
  clickHandler: (legalFactId: LegalFactId) => void;
  position?: 'first' | 'last' | 'middle';
  showMoreButtonLabel?: string;
  showLessButtonLabel?: string;
  showHistoryButton?: boolean;
  historyButtonLabel?: string;
  historyButtonClickHandler?: () => void;
};

/**
 * Timeline step component
 * @param key unique key
 * @param oppositeContent element on the left
 * @param variant dot type
 * @param content element on the right
 * @param stepPosition step position
 * @param size dot size
 */
const timelineStepCmp = (
  key: string | undefined,
  oppositeContent: ReactNode | undefined,
  variant: 'outlined' | 'filled' | undefined,
  content: ReactNode | undefined,
  stepPosition: 'first' | 'middle' | 'last',
  size: 'small' | 'default' = 'default'
) => (
  <TimelineNotificationItem key={key}>
    <TimelineNotificationOppositeContent>{oppositeContent}</TimelineNotificationOppositeContent>
    <TimelineNotificationSeparator>
      <TimelineConnector sx={{ visibility: stepPosition === 'first' ? 'hidden' : 'visible' }} />
      <TimelineNotificationDot variant={variant} size={size} />
      <TimelineConnector sx={{ visibility: stepPosition === 'last' ? 'hidden' : 'visible' }} />
    </TimelineNotificationSeparator>
    <TimelineNotificationContent>{content}</TimelineNotificationContent>
  </TimelineNotificationItem>
);

/**
 * Notification detail timeline
 * @param timelineStep data to show
 * @param recipients list of recipients
 * @param clickHandler function called when user clicks on the download button
 * @param legalFactLabels label of the download button
 * @param position step position
 * @param showHistoryButton show history button
 * @param historyButtonLabel label for history button
 * @param historyButtonClickHandler function called when user clicks on the history button
 * @param showMoreButtonLabel label of show more button
 * @param showLessButtonLabel label of show less button
 */
const NotificationDetailTimelineStep = ({
  timelineStep,
  recipients,
  legalFactLabels,
  clickHandler,
  position = 'middle',
  showMoreButtonLabel,
  showLessButtonLabel,
  showHistoryButton = false,
  historyButtonLabel,
  historyButtonClickHandler,
}: Props) => {
  const [collapsed, setCollapsed] = useState(true);
  /* eslint-disable functional/no-let */
  let legalFactsIds: Array<{ file: LegalFactId; category: TimelineCategory }> = [];
  let visibleSteps: Array<INotificationDetailTimeline> = [];
  /* eslint-enable functional/no-let */
  const notificationStatusInfos = getNotificationStatusInfos(timelineStep.status);

  if (timelineStep.steps) {
    /* eslint-disable functional/immutable-data */
    legalFactsIds = timelineStep.steps.reduce((arr, s) => {
      if (s.legalFactsIds) {
        return arr.concat(s.legalFactsIds.map((lf) => ({ file: lf, category: s.category })));
      }
      return arr;
    }, [] as Array<{ file: LegalFactId; category: TimelineCategory }>);

    visibleSteps = timelineStep.steps.filter((s) => !s.hidden);
    /* eslint-enable functional/immutable-data */
  }

  const macroStep = timelineStepCmp(
    undefined,
    <Fragment>
      <Typography color="text.secondary" fontSize={14} data-testid="dateItem">
        {getMonthString(timelineStep.activeFrom)}
      </Typography>
      <Typography fontWeight={600} fontSize={18} data-testid="dateItem">
        {getDay(timelineStep.activeFrom)}
      </Typography>
    </Fragment>,
    position === 'first' ? 'outlined' : undefined,
    <Fragment>
      <Typography color="text.secondary" fontSize={14} data-testid="dateItem">
        {getTime(timelineStep.activeFrom)}
      </Typography>
      <Chip
        data-testid="itemStatus"
        label={notificationStatusInfos.label}
        color={position === 'first' ? notificationStatusInfos.color : 'default'}
        size={position === 'first' ? 'medium' : 'small'}
      />
      {showHistoryButton && historyButtonLabel ? (
        <Button
          data-testid="historyButton"
          sx={{ paddingLeft: 0, paddingRight: 0, marginTop: '5px' }}
          startIcon={<UnfoldMoreIcon />}
          onClick={historyButtonClickHandler}
        >
          {historyButtonLabel}
        </Button>
      ) : (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography color="text.primary" variant="caption">
            {getNotificationStatusInfos(timelineStep.status).description}
          </Typography>
          {legalFactsIds &&
            legalFactsIds.map((lf) => (
              <ButtonNaked
                key={lf.file.key}
                startIcon={<AttachFileIcon />}
                onClick={() => clickHandler(lf.file)}
                color="primary"
                sx={{ marginTop: '10px' }}
              >
                {getLegalFactLabel(lf.category, legalFactLabels)}
              </ButtonNaked>
            ))}
        </Box>
      )}
    </Fragment>,
    position
  );

  const moreLessButton = timelineStepCmp(
    undefined,
    undefined,
    undefined,
    <Box data-testid="moreLessButton">
      <ButtonNaked
        startIcon={collapsed ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? showMoreButtonLabel : showLessButtonLabel}
      </ButtonNaked>
    </Box>,
    'middle'
  );

  const microStep = (s: INotificationDetailTimeline) => {
    const timelineStatusInfos = getNotificationTimelineStatusInfos(s, recipients);
    if (!timelineStatusInfos) {
      return null;
    }
    return timelineStepCmp(
      s.elementId,
      <Fragment>
        <Typography color="text.secondary" fontSize={14} data-testid="dateItem">
          {getMonthString(s.timestamp)}
        </Typography>
        <Typography fontWeight={600} fontSize={18} data-testid="dateItem">
          {getDay(s.timestamp)}
        </Typography>
      </Fragment>,
      undefined,
      <Fragment>
        <Typography color="text.secondary" fontSize={14} data-testid="dateItem">
          {getTime(s.timestamp)}
        </Typography>
        <Typography
          color="text.primary"
          fontSize={14}
          fontWeight={600}
          variant="caption"
          letterSpacing="0.5px"
        >
          {timelineStatusInfos.label}
        </Typography>
        <Box>
          <Typography color="text.primary" fontSize={14}>
            {timelineStatusInfos.description}&nbsp;
            {timelineStatusInfos.linkText && s.legalFactsIds && (
              <Typography
                fontSize={14}
                display="inline"
                variant="button"
                color="primary"
                sx={{ cursor: 'pointer' }}
                onClick={() => s.legalFactsIds && clickHandler(s.legalFactsIds[0])}
              >
                {timelineStatusInfos.linkText}
              </Typography>
            )}
          </Typography>
        </Box>
        {recipients.length > 1 && (
          <Box>
            <Typography fontSize={14} color="text.secondary">
              {timelineStatusInfos.recipient}
            </Typography>
          </Box>
        )}
      </Fragment>,
      'middle',
      'small'
    );
  };

  return (
    <Fragment>
      {macroStep}
      {!showHistoryButton && visibleSteps.length > 0 && moreLessButton}
      {!collapsed && visibleSteps.map((s) => microStep(s))}
    </Fragment>
  );
};

export default NotificationDetailTimelineStep;
