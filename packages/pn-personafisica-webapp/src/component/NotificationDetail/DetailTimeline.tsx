import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import {
  getDay,
  getMonthString,
  getTime,
  LegalFactId,
  NotificationDetail,
} from '@pagopa-pn/pn-commons';
import { getNotificationStatusLabelAndColorFromTimelineCategory } from '../../utils/status.utility';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { getReceivedNotificationLegalfact } from '../../redux/notification/actions';

type Props = {
  notification: NotificationDetail;
};

const DetailTimeline = ({ notification }: Props) => {
  const { t } = useTranslation(['notifiche']);
  const dispatch = useAppDispatch();
  const legalFactDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadUrl
  );

  const clickHandler = (legalFact: LegalFactId) => {
    void dispatch(getReceivedNotificationLegalfact({ iun: notification.iun, legalFact }));
  };

  useEffect(() => {
    if (legalFactDownloadUrl) {
      /* eslint-disable functional/immutable-data */
      const link = document.createElement('a');
      link.href = legalFactDownloadUrl;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.click();
      /* eslint-enable functional/immutable-data */
    }
  }, [legalFactDownloadUrl]);

  return (
    <Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography color="text.primary" fontWeight={700} textTransform="uppercase" fontSize={14}>
            {t('Stato della notifica')}
          </Typography>
        </Grid>
        {/* TODO: ripristinare quando sarà completata la issue pn-719 */}
        {/* <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti gli allegati</Button>
        </Grid> */}
      </Grid>
      <Timeline>
        {notification.timeline.map((timelineItem, i) => (
          <TimelineItem key={timelineItem.elementId} data-testid="timelineItem">
            <TimelineOppositeContent sx={{ textAlign: 'center', margin: 'auto 0' }}>
              <Typography color="text.secondary" fontSize={14}>
                {getMonthString(timelineItem.timestamp)}
              </Typography>
              <Typography fontWeight={600} fontSize={18}>
                {getDay(timelineItem.timestamp)}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot variant={i === 0 ? 'outlined' : undefined} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ flex: '3', msFlex: '3', WebkitFlex: '3', padding: '10px 16px' }}>
              <Typography color="text.secondary" fontSize={14} sx={{ paddingBottom: '8px' }}>
                {getTime(timelineItem.timestamp)}
              </Typography>
              <Chip
                data-testid="itemStatus"
                label={
                  getNotificationStatusLabelAndColorFromTimelineCategory(
                    timelineItem,
                    notification.notificationStatusHistory
                  ).label
                }
                color={
                  getNotificationStatusLabelAndColorFromTimelineCategory(
                    timelineItem,
                    notification.notificationStatusHistory
                  ).color
                }
              />
              <Box>
                {timelineItem.legalFactsIds &&
                  timelineItem.legalFactsIds.map((lf) => (
                    <Button
                      key={lf.key}
                      sx={{ paddingLeft: 0, paddingRight: 0, marginTop: '5px' }}
                      startIcon={<AttachFileIcon />}
                      onClick={() => clickHandler(lf)}
                    >
                      {t('Attestato opponibile a Terzi')}
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
