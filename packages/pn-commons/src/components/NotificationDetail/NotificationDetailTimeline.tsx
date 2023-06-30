import { Fragment, useState } from 'react';
import { Typography, Grid, Drawer, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { TimelineNotification } from '@pagopa/mui-italia';

import {
  LegalFactId,
  NotificationStatusHistory,
  NotificationDetailRecipient,
  NotificationDetailOtherDocument,
} from '../../types';
import { useIsMobile } from '../../hooks';
import NotificationDetailTimelineStep from './NotificationDetailTimelineStep';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
  statusHistory: Array<NotificationStatusHistory>;
  title: string;
  // legalFact can be either a LegalFactId, or a NotificationDetailOtherDocument 
  // (generated from details.generatedAarUrl in ANALOG_FAILURE_WORKFLOW timeline elements).
  // Cfr. comment in the definition of INotificationDetailTimeline in src/types/NotificationDetail.ts.
  clickHandler: (legalFactId: LegalFactId | NotificationDetailOtherDocument) => void;
  historyButtonLabel: string;
  showMoreButtonLabel: string;
  showLessButtonLabel: string;
  eventTrackingCallbackShowMore?: () => void;
};

const CustomDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: '100%',
  },
  '& .MuiTimeline-root': {
    marginTop: 0,
    paddingTop: 0,
  },
}));

/**
 * Notification detail timeline
 * @param recipients list of recipients
 * @param statusHistory notification macro-status history
 * @param clickHandler function called when user clicks on the download button
 * @param title title to show
 * @param historyButtonLabel label of the history button
 * @param showMoreButtonLabel label of show more button
 * @param showLessButtonLabel label of show less button
 * @param eventTrackingCallbackShowMore event tracking callback
 */
const NotificationDetailTimeline = ({
  recipients,
  statusHistory,
  clickHandler,
  title,
  historyButtonLabel,
  showMoreButtonLabel,
  showLessButtonLabel,
  eventTrackingCallbackShowMore
}: Props) => {
  const [state, setState] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile && state) {
    setState(false);
  }

  const toggleHistoryDrawer = () => {
    setState(!state);
  };

  const getPosition = (index: number): 'first' | 'last' | undefined => {
    if (index === 0) {
      return 'first';
    }
    if (index === statusHistory.length - 1) {
      return 'last';
    }
    return undefined;
  };

  const timelineComponent = statusHistory.map((t, i) => (
    <NotificationDetailTimelineStep
      timelineStep={t}
      recipients={recipients}
      position={getPosition(i)}
      clickHandler={clickHandler}
      key={'timeline_sep_' + i}
      showMoreButtonLabel={showMoreButtonLabel}
      showLessButtonLabel={showLessButtonLabel}
      eventTrackingCallbackShowMore={eventTrackingCallbackShowMore}
    />
  ));

  return (
    <Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography
            component="h5"
            color="text.primary"
            fontWeight={700}
            textTransform="uppercase"
            fontSize={14}
          >
            {title}
          </Typography>
        </Grid>
        {/* TODO: ripristinare quando sarà completata la issue pn-719 */}
        {/* <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti gli allegati</Button>
        </Grid> */}
      </Grid>
      <TimelineNotification>
        {isMobile && statusHistory.length > 0 ? (
          <NotificationDetailTimelineStep
            timelineStep={statusHistory[0]}
            recipients={recipients}
            position="first"
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
        <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3 }}>
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
        <Box sx={{ px: 3, height: 'calc(100vh - 87px)', overflowY: 'scroll' }}>
          <TimelineNotification>{timelineComponent}</TimelineNotification>
        </Box>
      </CustomDrawer>
    </Fragment>
  );
};

export default NotificationDetailTimeline;
