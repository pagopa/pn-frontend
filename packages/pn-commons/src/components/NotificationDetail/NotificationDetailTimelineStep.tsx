import { Fragment, ReactNode, useState } from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { TimelineConnector } from '@mui/lab';
import { Box, Button, Chip, Typography } from '@mui/material';
import {
  ButtonNaked,
  Tag,
  TimelineNotificationContent,
  TimelineNotificationDot,
  TimelineNotificationItem,
  TimelineNotificationOppositeContent,
  TimelineNotificationSeparator,
} from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks/useIsMobile';
import {
  INotificationDetailTimeline,
  LegalFactId,
  NotificationDetailRecipient,
  NotificationStatusHistory,
  ReworkedStatus,
  TimelineCategory,
} from '../../models/NotificationDetail';
import { NotificationStatus } from '../../models/NotificationStatus';
import { formatDay, formatMonthString, formatTime } from '../../utility/date.utility';
import {
  getLegalFactLabel,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
} from '../../utility/notification.utility';

type Props = {
  timelineStep: NotificationStatusHistory;
  recipients: Array<NotificationDetailRecipient>;
  clickHandler: (legalFactId: LegalFactId) => void;
  position?: 'first' | 'last' | 'middle';
  showMoreButtonLabel?: string;
  showLessButtonLabel?: string;
  showHistoryButton?: boolean;
  historyButtonLabel?: string;
  historyButtonClickHandler?: () => void;
  handleTrackShowMoreLess?: (collapsed: boolean) => void;
  disableDownloads?: boolean;
  isParty?: boolean;
  language?: string;
  reworkedStatus?: ReworkedStatus;
};

/**
 * Timeline step component
 * @param oppositeContent element on the left
 * @param variant dot type
 * @param content element on the right
 * @param stepPosition step position
 * @param size dot size
 */
type StepProps = {
  oppositeContent?: ReactNode;
  variant?: 'outlined' | 'filled';
  content?: ReactNode;
  stepPosition: 'first' | 'middle' | 'last';
  size?: 'small' | 'default';
};

const TimelineStepCmp: React.FC<StepProps> = ({
  oppositeContent,
  variant,
  content,
  stepPosition,
  size = 'default',
}) => {
  const isMobile = useIsMobile();
  return (
    <TimelineNotificationItem>
      <TimelineNotificationOppositeContent sx={{ pr: isMobile ? 1 : 2, justifyContent: 'center' }}>
        {oppositeContent}
      </TimelineNotificationOppositeContent>
      <TimelineNotificationSeparator>
        <TimelineConnector sx={{ visibility: stepPosition === 'first' ? 'hidden' : 'visible' }} />
        <TimelineNotificationDot variant={variant} size={size} />
        <TimelineConnector sx={{ visibility: stepPosition === 'last' ? 'hidden' : 'visible' }} />
      </TimelineNotificationSeparator>
      <TimelineNotificationContent sx={{ py: 2, pl: isMobile ? 1 : 5, pr: 0, m: 0 }}>
        {content}
      </TimelineNotificationContent>
    </TimelineNotificationItem>
  );
};

/**
 * Notification detail timeline
 * This component used to display a timeline of events or notifications,
 * allowing users to expand and collapse additional details as needed.
 * The component's behavior and appearance can be customized by passing various props to it.
 * @param timelineStep data to show
 * @param recipients list of recipients
 * @param clickHandler function called when user clicks on the download button
 * @param position step position
 * @param showHistoryButton show history button
 * @param historyButtonLabel label for history button
 * @param historyButtonClickHandler function called when user clicks on the history button
 * @param showMoreButtonLabel label of show more button
 * @param showLessButtonLabel label of show less button
 * @param completeStatusHistory the whole history, sometimes some information from a different status must be retrieved
 * @param disableDownloads if notification is disabled
 * @param isParty if is party chip rendered with opacity for status cancellation in progress
 * @param language used to translate months in timeline
 * @param reworkedStatus if the element has a reworked tag to display
 */

const NotificationDetailTimelineStep = ({
  timelineStep,
  recipients,
  clickHandler,
  position = 'middle',
  showMoreButtonLabel,
  showLessButtonLabel,
  showHistoryButton = false,
  historyButtonLabel,
  historyButtonClickHandler,
  handleTrackShowMoreLess,
  disableDownloads,
  isParty = true,
  language = 'it',
  reworkedStatus,
}: Props) => {
  const [collapsed, setCollapsed] = useState(true);
  /* eslint-disable functional/no-let */
  let legalFactsIds: Array<{
    file: LegalFactId;
    step: INotificationDetailTimeline;
  }> = [];
  let visibleSteps: Array<INotificationDetailTimeline> = [];
  /* eslint-enable functional/no-let */

  const notificationStatusInfos = getNotificationStatusInfos(timelineStep, { recipients });

  const getTag = (status: ReworkedStatus | undefined) => {
    switch (status) {
      case ReworkedStatus.VALID:
        return <Tag value="Evento Validato" />;
      case ReworkedStatus.NOT_VALID:
        return <Tag value="Evento Non Validato" />;
      default:
        return null;
    }
  };

  if (timelineStep.steps) {
    /* eslint-disable functional/immutable-data */
    legalFactsIds = timelineStep.steps.reduce((arr, s) => {
      if (s.legalFactsIds && (collapsed || (!collapsed && s.hidden))) {
        return arr.concat(s.legalFactsIds.map((lf) => ({ file: lf, step: s })));
      }
      return arr;
    }, [] as Array<{ file: LegalFactId; step: INotificationDetailTimeline }>);

    visibleSteps = timelineStep.steps.filter((s) => !s.hidden);
    /* eslint-enable functional/immutable-data */
  }

  const getChipColor = (position: string, status: NotificationStatus, color?: string) => {
    if (position === 'first') {
      return color;
    }
    if (status === NotificationStatus.NOTIFICATION_TIMELINE_REWORKED) {
      return 'warning';
    }

    return 'default';
  };

  const macroStep = (
    <TimelineStepCmp
      oppositeContent={
        <Fragment>
          <Typography color="text.secondary" fontSize={14} data-testid="dateItem">
            {formatMonthString(timelineStep.activeFrom, language)}
          </Typography>
          <Typography fontWeight={600} fontSize={18} data-testid="dateItem">
            {formatDay(timelineStep.activeFrom)}
          </Typography>
        </Fragment>
      }
      variant={position === 'first' ? 'outlined' : undefined}
      content={
        <Fragment>
          <Typography color="text.secondary" fontSize={14} data-testid="dateItem">
            {formatTime(timelineStep.activeFrom)}
          </Typography>
          {getTag(reworkedStatus)}
          <Chip
            id={`${notificationStatusInfos.label}-status`}
            data-testid="itemStatus"
            label={notificationStatusInfos.label}
            color={getChipColor(position, timelineStep.status, notificationStatusInfos.color)}
            // color={position === 'first' ? notificationStatusInfos.color : 'default'}
            size={position === 'first' ? 'medium' : 'small'}
            sx={{
              opacity:
                timelineStep.status === NotificationStatus.CANCELLATION_IN_PROGRESS && isParty
                  ? '0.5'
                  : '1',
            }}
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
                {notificationStatusInfos.description}
              </Typography>
              {legalFactsIds &&
                legalFactsIds.length > 0 &&
                legalFactsIds.map((lf) => (
                  <ButtonNaked
                    key={lf.file.key}
                    startIcon={<AttachFileIcon />}
                    onClick={() => clickHandler(lf.file)}
                    color="primary"
                    sx={{ marginTop: '10px', textAlign: 'left' }}
                    data-testid="download-legalfact"
                    disabled={
                      lf.step.category !== TimelineCategory.NOTIFICATION_CANCELLED &&
                      disableDownloads
                    }
                  >
                    {getLegalFactLabel(lf.step, lf.file.category, lf.file.key || '')}
                  </ButtonNaked>
                ))}
            </Box>
          )}
        </Fragment>
      }
      stepPosition={position}
    />
  );

  const handleShowMoreClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    handleTrackShowMoreLess && handleTrackShowMoreLess(!collapsed);
    setCollapsed(!collapsed);
  };

  const moreLessButton = (
    <TimelineStepCmp
      content={
        <Box data-testid="moreLessButton">
          <ButtonNaked
            id="more-less-timeline-step"
            data-testid="more-less-timeline-step"
            startIcon={collapsed ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
            onClick={handleShowMoreClick}
          >
            {collapsed ? showMoreButtonLabel : showLessButtonLabel}
          </ButtonNaked>
        </Box>
      }
      stepPosition="middle"
    />
  );

  const microStep = (s: INotificationDetailTimeline) => {
    const timelineStatusInfos = getNotificationTimelineStatusInfos(
      s,
      recipients,
      timelineStep.steps
    );
    if (!timelineStatusInfos) {
      return null;
    }
    return (
      <TimelineStepCmp
        key={s.elementId}
        oppositeContent={
          <Fragment>
            <Typography color="text.secondary" fontSize={14} data-testid="dateItemMicro">
              {formatMonthString(s.timestamp, language)}
            </Typography>
            <Typography fontWeight={600} fontSize={18} data-testid="dateItemMicro">
              {formatDay(s.timestamp)}
            </Typography>
          </Fragment>
        }
        content={
          <Fragment>
            <Typography color="text.secondary" fontSize={14} data-testid="dateItemMicro">
              {formatTime(s.timestamp)}
            </Typography>
            {getTag(reworkedStatus)}
            <Typography
              color="text.primary"
              fontSize={14}
              fontWeight={600}
              variant="caption"
              letterSpacing="0.5px"
            >
              {timelineStatusInfos.label}
            </Typography>
            <Box sx={{ overflowWrap: 'anywhere' }}>
              <Typography color="text.primary" fontSize={14}>
                {timelineStatusInfos.description}
              </Typography>
              {s.legalFactsIds &&
                s.legalFactsIds.length > 0 &&
                s.legalFactsIds.map((lf) => (
                  <ButtonNaked
                    fontSize={14}
                    color="primary"
                    onClick={() => clickHandler(lf)}
                    disabled={disableDownloads}
                    key={lf.key}
                    data-testid="download-legalfact-micro"
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                    }}
                  >
                    {getLegalFactLabel(s, lf.category, lf.key || '')}
                  </ButtonNaked>
                ))}
            </Box>
          </Fragment>
        }
        stepPosition="middle"
        size="small"
      />
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
