import { TimelineConnector, TimelineSeparator } from '@mui/lab';
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
  ButtonNaked,
} from '@pagopa/mui-italia';

import { getDay, getMonthString, getTime } from '../../utils/date.utility';
import { getNotificationStatusLabelAndColor } from '../../utils/status.utility';
import { NotificationDetailTimelineData, LegalFactId } from '../../types/NotificationDetail';

type Props = {
  timelineStep: NotificationDetailTimelineData;
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
 * @param clickHandler function called when user clicks on the download button
 * @param legalFactLabel label of the download button
 * @param position step position
 * @param showHistoryButton show history button
 * @param historyButtonLabel label for history button
 * @param historyButtonClickHandler function called when user clicks on the history button
 */
const NotificationDetailTimelineStep = ({
  timelineStep,
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

  if (timelineStep.steps) {
    for (const step of timelineStep.steps) {
      if (step.legalFactsIds) {
        legalFactsIds.push(...step.legalFactsIds);
      }
    }
  }

  const timelineStepCmp = (
    key: string | undefined,
    oppositeContent: ReactNode | undefined,
    variant: 'outlined' | 'filled' | undefined,
    content: ReactNode | undefined,
    position: 'first' | 'middle' | 'last'
  ) => (
    <TimelineNotificationItem key={key}>
      <TimelineNotificationOppositeContent>{oppositeContent}</TimelineNotificationOppositeContent>
      <TimelineSeparator>
        <TimelineConnector sx={{visibility: position === 'first' ? 'hidden' : 'visible'}}/>
        <TimelineNotificationDot variant={variant} />
        <TimelineConnector sx={{visibility: position === 'last' ? 'hidden' : 'visible'}}/>
      </TimelineSeparator>
      <TimelineNotificationContent>{content}</TimelineNotificationContent>
    </TimelineNotificationItem>
  );

  return (
    <Fragment>
      {timelineStepCmp(
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
            label={getNotificationStatusLabelAndColor(timelineStep.status).label}
            color={getNotificationStatusLabelAndColor(timelineStep.status).color}
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
            <Box>
              <Typography color="text.primary" fontSize={16}>
                Lorem ipsum
              </Typography>
              {legalFactsIds &&
                legalFactsIds.map((lf) => (
                  <ButtonNaked
                    key={lf.key}
                    startIcon={<AttachFileIcon />}
                    onClick={() => clickHandler(lf)}
                    color="primary"
                  >
                    {legalFactLabel}
                  </ButtonNaked>
                ))}
            </Box>
          )}
        </Fragment>,
        position
      )}
      {!showHistoryButton &&
        timelineStep.steps.length > 0 &&
        timelineStepCmp(
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
        )}
      {!collapsed &&
        timelineStep.steps.map((s) =>
          timelineStepCmp(
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
              <Typography color="text.primary" fontSize={16} >
                {s.category}
              </Typography>
            </Fragment>,
            'middle'
          )
        )}
    </Fragment>
  );
};

export default NotificationDetailTimelineStep;
