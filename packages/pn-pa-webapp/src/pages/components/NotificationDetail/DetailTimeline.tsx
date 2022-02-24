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
import DownloadIcon from '@mui/icons-material/Download';

import { NotificationDetail } from '../../../redux/notification/types';
import { getMonthString, getDay, getTime } from '../../../utils/date.utility';
import { getNotificationStatusLabelAndColorFromTimelineCategory } from '../../../utils/status.utility';

type Props = {
  notification: NotificationDetail;
};

const DetailTimeline = ({ notification }: Props) => (
  <Fragment>
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography
          color="text.primary"
          fontWeight={700}
          textTransform="uppercase"
          fontSize={14}
        >
          Stato della notifica
        </Typography>
      </Grid>
      <Grid item>
        <Button startIcon={<DownloadIcon />}>Scarica tutti gli allegati</Button>
      </Grid>
    </Grid>
    <Timeline>
      {notification.timeline.map((t, i) => (
        <TimelineItem key={t.elementId}>
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
              label={
                getNotificationStatusLabelAndColorFromTimelineCategory(
                  t,
                  notification.notificationStatusHistory
                ).label
              }
              color={
                getNotificationStatusLabelAndColorFromTimelineCategory(
                  t,
                  notification.notificationStatusHistory
                ).color
              }
            />
            <Box>
              <Button
                sx={{ paddingLeft: 0, paddingRight: 0, marginTop: '5px' }}
                startIcon={<AttachFileIcon />}
              >
                Attestato opponibile a Terzi
              </Button>
            </Box>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  </Fragment>
);

export default DetailTimeline;
