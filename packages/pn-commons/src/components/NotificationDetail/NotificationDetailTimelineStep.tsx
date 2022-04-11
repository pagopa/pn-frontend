import { TimelineConnector } from '@mui/lab';
import { useState, Fragment, ReactNode } from 'react';
import { Typography, Chip, Box, Button } from '@mui/material';
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
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
} from '../../utils/status.utility';
import {
  NotificationDetailTimelineData,
  LegalFactId,
  INotificationDetailTimeline,
  NotificationDetailRecipient,
} from '../../types/NotificationDetail';

type Props = {
  timelineStep: NotificationDetailTimelineData;
  recipients: Array<NotificationDetailRecipient>;
  legalFactLabel: string;
  clickHandler: (legalFactId: LegalFactId) => void;
  position?: 'first' | 'last' | 'middle';
  showMoreButtonLabel?: string;
  showLessButtonLabel?: string;
  showHistoryButton?: boolean;
  historyButtonLabel?: string;
  historyButtonClickHandler?: () => void;
};

/**
 * Notification detail timeline
 * @param timelineStep data to show
 * @param recipients list of recipients
 * @param clickHandler function called when user clicks on the download button
 * @param legalFactLabel label of the download button
 * @param position step position
 * @param showHistoryButton show history button
 * @param historyButtonLabel label for history button
 * @param historyButtonClickHandler function called when user clicks on the history button
 */
const NotificationDetailTimelineStep = ({
  timelineStep,
  recipients,
  legalFactLabel,
  clickHandler,
  position = 'middle',
  showMoreButtonLabel,
  showLessButtonLabel,
  showHistoryButton = false,
  historyButtonLabel,
  historyButtonClickHandler,
}: Props) => {
  const [collapsed, setCollapsed] = useState(true);
  const legalFactsIds: Array<LegalFactId> = [];
  const notificationStatusInfos = getNotificationStatusInfos(timelineStep.status);

  for (const step of timelineStep.steps) {
    if (step.legalFactsIds) {
      legalFactsIds.push(...step.legalFactsIds);
    }
  }

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
                key={lf.key}
                startIcon={<AttachFileIcon />}
                onClick={() => clickHandler(lf)}
                color="primary"
                sx={{ marginTop: '10px' }}
              >
                {legalFactLabel}
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
          <Typography color="text.primary" fontSize={14} display="inline" variant="caption">
            {timelineStatusInfos.description}&nbsp;
          </Typography>
          {timelineStatusInfos.linkText && (
            <Typography fontSize={14} display="inline" variant="button" color="primary" sx={{cursor: "pointer"}}>
              {timelineStatusInfos.linkText}
            </Typography>
          )}
        </Box>
      </Fragment>,
      'middle',
      'small'
    );
  };

  return (
    <Fragment>
      {macroStep}
      {!showHistoryButton && timelineStep.steps.length > 0 && moreLessButton}
      {!collapsed && timelineStep.steps.map((s) => microStep(s))}
    </Fragment>
  );
};

export default NotificationDetailTimelineStep;
