import { Fragment, useState } from 'react';
import { Typography, Grid, Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { TimelineNotification } from "@pagopa/mui-italia";

import {
  LegalFactId,
  INotificationDetailTimeline,
  NotificationStatusHistory,
  NotificationDetailTimelineData
} from '../../types/NotificationDetail';
import { useIsMobile } from '../../hooks/IsMobile.hook';
import NotificationDetailTimelineStep from './NotificationDetailTimelineStep';

type Props = {
  timeline: Array<INotificationDetailTimeline>;
  statusHistory: Array<NotificationStatusHistory>;
  title: string;
  legalFactLabel: string;
  clickHandler: (legalFactId: LegalFactId) => void;
  historyButtonLabel: string;
  showMoreButtonLabel: string;
  showLessButtonLabel: string;
};

const CustomDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: '100%'
  },
  '& .MuiTimeline-root': {
    marginTop: 0,
    paddingTop: 0
  }
}));

/**
 * Notification detail timeline
 * @param timeline data to show
 * @param statusHistory notification macro-status history
 * @param clickHandler function called when user clicks on the download button
 * @param title title to show
 * @param legalFactLabel label of the download button
 * @param historyButtonLabel label of the history button
 */
const NotificationDetailTimeline = ({
  timeline,
  statusHistory,
  clickHandler,
  title,
  legalFactLabel,
  historyButtonLabel,
  showMoreButtonLabel,
  showLessButtonLabel
}: Props) => {
  const [state, setState] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile && state) {
    setState(false);
  }

  const toggleHistoryDrawer = () => {
    setState(!state);
  };

  const timeLineData: Array<NotificationDetailTimelineData> = [];
  if (timeline.length > 0 && statusHistory.length > 0) {
    for (const status of statusHistory) {
      const timeLineDataStep: NotificationDetailTimelineData = {...status, steps: []};
      // find timeline steps that are linked with current status
      for (const timelineElement of status.relatedTimelineElements) {
        const step = timeline.find(t => t.elementId === timelineElement);
        if (step) {
          timeLineDataStep.steps.push(step);
        }
      }
      // order step by time
      timeLineDataStep.steps.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      timeLineData.push(timeLineDataStep);
    }
  }

  const getPosition = (index: number): 'first' | 'last' | undefined => {
    if (index === 0) {
      return 'first';
    }
    if (index === timeLineData.length - 1) {
      return 'last';
    }
    return undefined;
  }

  const timelineComponent = timeLineData.map((t, i) => (
    <NotificationDetailTimelineStep
      timelineStep={t}
      position={getPosition(i)}
      legalFactLabel={legalFactLabel}
      clickHandler={clickHandler}
      key={t.activeFrom}
      showMoreButtonLabel={showMoreButtonLabel}
      showLessButtonLabel={showLessButtonLabel}
    />
  ));

  return (
    <Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography color="text.primary" fontWeight={700} textTransform="uppercase" fontSize={14}>
            {title}
          </Typography>
        </Grid>
        {/* TODO: ripristinare quando sarà completata la issue pn-719 */}
        {/* <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti gli allegati</Button>
        </Grid> */}
      </Grid>
      <TimelineNotification>
        {isMobile && timeLineData.length > 0 ? (
          <NotificationDetailTimelineStep
            timelineStep={timeLineData[0]}
            position="first"
            legalFactLabel={legalFactLabel}
            clickHandler={clickHandler}
            historyButtonLabel={historyButtonLabel}
            showHistoryButton
            historyButtonClickHandler={toggleHistoryDrawer}
          />
        ) : (
          timelineComponent
        )}
      </TimelineNotification>
      <CustomDrawer anchor="left" open={state} onClose={toggleHistoryDrawer}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: '24px' }}>
          <Grid item>
            <Typography
              color="text.primary"
              fontWeight={700}
              textTransform="uppercase"
              fontSize={14}
            >
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <CloseIcon
              onClick={toggleHistoryDrawer}
              sx={{
                color: 'action.active',
                width: '32px',
                height: '32px',
              }}
            />
          </Grid>
        </Grid>
        <TimelineNotification sx={{marginTop: 0, paddingTop: 0, background: 'red'}}>{timelineComponent}</TimelineNotification>
      </CustomDrawer>
    </Fragment>
  );
};

export default NotificationDetailTimeline;
