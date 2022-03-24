import { Fragment, useState } from 'react';
import { Timeline } from '@mui/lab';
import { Typography, Grid, Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

import {
  LegalFactId,
  INotificationDetailTimeline,
  NotificationStatusHistory,
} from '../../types/Notifications';
import { useIsMobile } from '../../hooks/IsMobile.hook';
import NotificationDetailTimelineStep from './NotificationDetailTimelineStep';

type Props = {
  timeline: Array<INotificationDetailTimeline>;
  statusHistory: Array<NotificationStatusHistory>;
  title: string;
  legalFactLabel: string;
  clickHandler: (legalFactId: LegalFactId) => void;
  historyButtonLabel: string;
};

const CustomDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: '100%'
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
}: Props) => {
  const [state, setState] = useState(false);
  const isMobile = useIsMobile();

  const toggleHistoryDrawer = () => {
    setState(!state);
  };

  const timelineCmp = timeline.map((t, i) => (
    <NotificationDetailTimelineStep
      timelineStep={t}
      index={i}
      legalFactLabel={legalFactLabel}
      statusHistory={statusHistory}
      clickHandler={clickHandler}
      key={t.elementId}
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
      <Timeline>
        {isMobile && timeline.length > 0 ? (
          <NotificationDetailTimelineStep
            timelineStep={timeline[0]}
            index={0}
            legalFactLabel={legalFactLabel}
            statusHistory={statusHistory}
            clickHandler={clickHandler}
            historyButtonLabel={historyButtonLabel}
            showHistoryButton
            historyButtonClickHandler={toggleHistoryDrawer}
          />
        ) : (
          timelineCmp
        )}
      </Timeline>
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
        <Timeline>{timelineCmp}</Timeline>
      </CustomDrawer>
    </Fragment>
  );
};

export default NotificationDetailTimeline;
