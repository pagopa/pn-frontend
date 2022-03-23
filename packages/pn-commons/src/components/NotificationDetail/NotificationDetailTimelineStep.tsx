import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Typography, Chip, Box, Button } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

import { getDay, getMonthString, getTime } from '../../utils/date.utility';
import { getNotificationStatusLabelAndColorFromTimelineCategory } from '../../utils/status.utility';
import {
  INotificationDetailTimeline,
  LegalFactId,
  NotificationStatusHistory,
} from '../../types/Notifications';

type Props = {
  timelineStep: INotificationDetailTimeline;
  statusHistory: Array<NotificationStatusHistory>;
  legalFactLabel: string;
  clickHandler: (legalFactId: LegalFactId) => void;
  index: number;
  showHistoryButton?: boolean;
  historyButtonLabel?: string; 
  historyButtonClickHandler?: () => void;
};

/**
 * Notification detail timeline
 * @param timelineStep data to show
 * @param statusHistory notification macro-status history
 * @param clickHandler function called when user clicks on the download button
 * @param legalFactLabel label of the download button
 * @param index step index
 * @param showHistoryButton show history button
 * @param historyButtonLabel label for history button
 * @param historyButtonClickHandler function called when user clicks on the history button
 */
const NotificationDetailTimelineStep = ({
  timelineStep,
  statusHistory,
  legalFactLabel,
  clickHandler,
  index,
  showHistoryButton = false,
  historyButtonLabel,
  historyButtonClickHandler
}: Props) => {
  return (
    <TimelineItem data-testid="timelineItem">
      <TimelineOppositeContent sx={{ textAlign: 'center', margin: 'auto 0' }}>
        <Typography color="text.secondary" fontSize={14}>
          {getMonthString(timelineStep.timestamp)}
        </Typography>
        <Typography fontWeight={600} fontSize={18}>
          {getDay(timelineStep.timestamp)}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot variant={index === 0 ? 'outlined' : undefined} />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ flex: '3', msFlex: '3', WebkitFlex: '3', padding: '10px 16px' }}>
        <Typography color="text.secondary" fontSize={14} sx={{ paddingBottom: '8px' }}>
          {getTime(timelineStep.timestamp)}
        </Typography>
        <Chip
          data-testid="itemStatus"
          label={
            getNotificationStatusLabelAndColorFromTimelineCategory(timelineStep, statusHistory)
              .label
          }
          color={
            getNotificationStatusLabelAndColorFromTimelineCategory(timelineStep, statusHistory)
              .color
          }
        />
        {showHistoryButton && historyButtonLabel ? (
          <Button
            data-testid="historyButton"
            sx={{ paddingLeft: 0, paddingRight: 0, marginTop: '5px' }}
            startIcon={<UnfoldMoreIcon />}
            onClick={historyButtonClickHandler}
          >{historyButtonLabel}</Button>
        ) : (
          <Box>
            {timelineStep.legalFactsIds &&
              timelineStep.legalFactsIds.map((lf) => (
                <Button
                  key={lf.key}
                  sx={{ paddingLeft: 0, paddingRight: 0, marginTop: '5px' }}
                  startIcon={<AttachFileIcon />}
                  onClick={() => clickHandler(lf)}
                >
                  {legalFactLabel}
                </Button>
              ))}
          </Box>
        )}
      </TimelineContent>
    </TimelineItem>
  );
};

export default NotificationDetailTimelineStep;
