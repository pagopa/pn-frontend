import { Fragment } from 'react';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Typography, Box, Button, Chip, Grid } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { getNotificationStatusLabelAndColorFromTimelineCategory } from '../../utils/status.utility';
import { LegalFactId, INotificationDetailTimeline, NotificationStatusHistory } from '../../types/Notifications';
import { getDay, getMonthString, getTime } from '../../utils/date.utility';

type Props = {
  timeline: Array<INotificationDetailTimeline>;
  statusHistory: Array<NotificationStatusHistory>;
  title: string;
  legalFactLabel: string;
  clickHandler: (legalFactId: LegalFactId) => void;
};

const NotificationDetailTimeline = ({ timeline, statusHistory, clickHandler, title, legalFactLabel }: Props) => {
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
        {timeline.map((t, i) => (
          <TimelineItem key={t.elementId} data-testid="timelineItem">
            <TimelineOppositeContent sx={{ textAlign: 'center', margin: 'auto 0' }}>
              <Typography color="text.secondary" fontSize={14}>
                {getMonthString(t.timestamp)}
              </Typography>
              <Typography fontWeight={600} fontSize={18}>
                {getDay(t.timestamp)}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot variant={i === 0 ? 'outlined' : undefined} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ flex: '3', msFlex: '3', WebkitFlex: '3', padding: '10px 16px' }}>
              <Typography color="text.secondary" fontSize={14} sx={{ paddingBottom: '8px' }}>
                {getTime(t.timestamp)}
              </Typography>
              <Chip
                data-testid="itemStatus"
                label={
                  getNotificationStatusLabelAndColorFromTimelineCategory(
                    t,
                    statusHistory
                  ).label
                }
                color={
                  getNotificationStatusLabelAndColorFromTimelineCategory(
                    t,
                    statusHistory
                  ).color
                }
              />
              <Box>
                {t.legalFactsIds &&
                  t.legalFactsIds.map((lf) => (
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
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Fragment>
  );
};

export default NotificationDetailTimeline;
