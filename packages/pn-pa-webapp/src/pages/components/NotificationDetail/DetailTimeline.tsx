import { Fragment, useEffect } from 'react';
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

import { LegalFactId, NotificationDetail } from '../../../redux/notification/types';
import { getMonthString, getDay, getTime } from '../../../utils/date.utility';
import { getNotificationStatusLabelAndColorFromTimelineCategory } from '../../../utils/status.utility';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { getSentNotificationLegalfact } from '../../../redux/notification/actions';

type Props = {
  notification: NotificationDetail;
};

const DetailTimeline = ({ notification }: Props) => {
  const dispatch = useAppDispatch();
  const legalFactDownloadUrl = useAppSelector((state: RootState) => state.notificationState.legalFactDownloadUrl);
  
  const clickHandler = (legalFact: LegalFactId) => {
    void dispatch(getSentNotificationLegalfact({iun: notification.iun, legalFact}));
  };

  useEffect(() => {
    if (legalFactDownloadUrl) {
      /* eslint-disable functional/immutable-data */
      const link = document.createElement('a');
      link.href = legalFactDownloadUrl;
      link.download = `Attestato-opponibile-terzi.pdf`;
      link.click();
      /* eslint-enable functional/immutable-data */
    }
  }, [legalFactDownloadUrl]);

  return (
    <Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography color="text.primary" fontWeight={700} textTransform="uppercase" fontSize={14}>
            Stato della notifica
          </Typography>
        </Grid>
        {/* TODO: ripristinare quando sarà completata la issue pn-719 */}
        {/* <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti gli allegati</Button>
        </Grid> */}
      </Grid>
      <Timeline>
        {notification.timeline.map((t, i) => (
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
              <Chip data-testid="itemStatus"
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
                {t.legalFactsIds && (
                  t.legalFactsIds.map(lf => <Button
                    key={lf.key}
                    sx={{ paddingLeft: 0, paddingRight: 0, marginTop: '5px' }}
                    startIcon={<AttachFileIcon />} onClick={() => clickHandler(lf)}
                  >
                    Attestato opponibile a Terzi
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

export default DetailTimeline;
