import { Fragment, ReactNode, useState } from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { TimelineConnector } from '@mui/lab';
import { Box, Button, Chip, Typography } from '@mui/material';
import {
  ButtonNaked,
  TimelineNotificationContent,
  TimelineNotificationDot,
  TimelineNotificationItem,
  TimelineNotificationOppositeContent,
  TimelineNotificationSeparator,
} from '@pagopa/mui-italia';

import {
  INotificationDetailTimeline,
  LegalFactId,
  NotificationDetailOtherDocument,
  NotificationDetailRecipient,
  NotificationStatus,
  NotificationStatusHistory,
} from '../../types';
import {
  formatDay,
  formatMonthString,
  formatTime,
  getLegalFactLabel,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
} from '../../utility';

type Props = {
  timelineStep: NotificationStatusHistory;
  recipients: Array<NotificationDetailRecipient>;
  // legalFact can be either a LegalFactId, or a NotificationDetailOtherDocument
  // (generated from details.generatedAarUrl in ANALOG_FAILURE_WORKFLOW timeline elements).
  // Cfr. comment in the definition of INotificationDetailTimeline in src/types/NotificationDetail.ts.
  clickHandler: (legalFactId: LegalFactId | NotificationDetailOtherDocument) => void;
  position?: 'first' | 'last' | 'middle';
  showMoreButtonLabel?: string;
  showLessButtonLabel?: string;
  showHistoryButton?: boolean;
  historyButtonLabel?: string;
  historyButtonClickHandler?: () => void;
  eventTrackingCallbackShowMore?: () => void;
  disableDownloads?: boolean;
  isParty?: boolean;
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
 * @param eventTrackingCallbackShowMore event tracking callback
 * @param completeStatusHistory the whole history, sometimes some information from a different status must be retrieved
 * @param disableDownloads if notification is disabled
 * @param isParty if is party chip rendered with opacity for status cancellation in progress
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
  eventTrackingCallbackShowMore,
  disableDownloads,
  isParty = true,
}: Props) => {
  const [collapsed, setCollapsed] = useState(true);
  /* eslint-disable functional/no-let */
  let legalFactsIds: Array<{
    file: LegalFactId | NotificationDetailOtherDocument;
    step: INotificationDetailTimeline;
  }> = [];
  let visibleSteps: Array<INotificationDetailTimeline> = [];
  /* eslint-enable functional/no-let */

  const notificationStatusInfos = getNotificationStatusInfos(timelineStep, { recipients });

  if (timelineStep.steps) {
    /* eslint-disable functional/immutable-data */
    legalFactsIds = timelineStep.steps.reduce((arr, s) => {
      if (s.legalFactsIds && (collapsed || (!collapsed && s.hidden))) {
        return arr.concat(s.legalFactsIds.map((lf) => ({ file: lf, step: s })));
      }
      return arr;
    }, [] as Array<{ file: LegalFactId | NotificationDetailOtherDocument; step: INotificationDetailTimeline }>);

    visibleSteps = timelineStep.steps.filter((s) => !s.hidden);
    /* eslint-enable functional/immutable-data */
  }

  const macroStep = timelineStepCmp(
    undefined,
    <Fragment>
      <Typography color="text.secondary" fontSize={14} data-testid="dateItem">
        {formatMonthString(timelineStep.activeFrom)}
      </Typography>
      <Typography fontWeight={600} fontSize={18} data-testid="dateItem">
        {formatDay(timelineStep.activeFrom)}
      </Typography>
    </Fragment>,
    position === 'first' ? 'outlined' : undefined,
    <Fragment>
      <Typography color="text.secondary" fontSize={14} data-testid="dateItem">
        {formatTime(timelineStep.activeFrom)}
      </Typography>
      <Chip
        id={`${notificationStatusInfos.label}-status`}
        data-testid="itemStatus"
        label={notificationStatusInfos.label}
        color={position === 'first' ? notificationStatusInfos.color : 'default'}
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
                key={
                  (lf.file as LegalFactId).key ||
                  (lf.file as NotificationDetailOtherDocument).documentId
                }
                startIcon={<AttachFileIcon />}
                onClick={() => clickHandler(lf.file)}
                color="primary"
                sx={{ marginTop: '10px', textAlign: 'left' }}
                data-testid="download-legalfact"
                disabled={disableDownloads}
              >
                {getLegalFactLabel(
                  lf.step,
                  (lf.file as LegalFactId).category ||
                    (lf.file as NotificationDetailOtherDocument).documentType,
                  (lf.file as LegalFactId).key || ''
                )}
              </ButtonNaked>
            ))}
        </Box>
      )}
    </Fragment>,
    position
  );

  const handleShowMoreClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    eventTrackingCallbackShowMore && collapsed && eventTrackingCallbackShowMore();
    setCollapsed(!collapsed);
  };

  const moreLessButton = timelineStepCmp(
    undefined,
    undefined,
    undefined,
    <Box data-testid="moreLessButton">
      <ButtonNaked
        id="more-less-timeline-step"
        data-testid="more-less-timeline-step"
        startIcon={collapsed ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
        onClick={handleShowMoreClick}
      >
        {collapsed ? showMoreButtonLabel : showLessButtonLabel}
      </ButtonNaked>
    </Box>,
    'middle'
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
    return timelineStepCmp(
      s.elementId,
      <Fragment>
        <Typography color="text.secondary" fontSize={14} data-testid="dateItemMicro">
          {formatMonthString(s.timestamp)}
        </Typography>
        <Typography fontWeight={600} fontSize={18} data-testid="dateItemMicro">
          {formatDay(s.timestamp)}
        </Typography>
      </Fragment>,
      undefined,
      <Fragment>
        <Typography color="text.secondary" fontSize={14} data-testid="dateItemMicro">
          {formatTime(s.timestamp)}
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
        <Box sx={{ overflowWrap: 'anywhere' }}>
          <Typography color="text.primary" fontSize={14}>
            {timelineStatusInfos.description}&nbsp;
            {s.legalFactsIds &&
              s.legalFactsIds.length > 0 &&
              s.legalFactsIds.map((lf) => (
                <Typography
                  fontSize={14}
                  display="inline"
                  variant="button"
                  color={disableDownloads ? 'text.disabled' : 'primary'}
                  sx={{ cursor: disableDownloads ? 'default' : 'pointer' }}
                  onClick={() => clickHandler(lf)}
                  key={
                    (lf as LegalFactId).key || (lf as NotificationDetailOtherDocument).documentId
                  }
                  data-testid="download-legalfact-micro"
                >
                  {getLegalFactLabel(
                    s,
                    (lf as LegalFactId).category ||
                      (lf as NotificationDetailOtherDocument).documentType,
                    (lf as LegalFactId).key || ''
                  )}
                </Typography>
              ))}
          </Typography>
        </Box>
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
