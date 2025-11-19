import { useCallback, useEffect, useState } from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { Downtime } from '../../models/AppStatus';
import { NotificationStatusHistory } from '../../models/NotificationDetail';
import { NotificationStatus } from '../../models/NotificationStatus';
import { formatDate, isToday } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import { getSessionLanguage } from '../../utility/multilanguage.utility';
import ApiErrorWrapper from '../ApiError/ApiErrorWrapper';
import DowntimeLanguageBanner from '../DowntimeLanguageBanner';

type Props = {
  // the notification history, needed to compute the time range for the downtime events query
  notificationStatusHistory: Array<NotificationStatusHistory>;
  // action to obtain and set the downtime events to be shown ...
  fetchDowntimeEvents: (fromDate: string, toDate: string | undefined) => void;
  // ... so that such events are passed throught this prop
  downtimeEvents: Array<Downtime>;
  // action to obtain and set the legal fact document url ...
  fetchDowntimeLegalFactDocumentDetails: (legalFactId: string) => void;
  // api id for ApiErrorWrapper
  apiId: string;
  // for disabled downloads
  disableDownloads?: boolean;
  // link to the downtime example
  downtimeExampleLink: string;
};

/*
 * Some auxiliary functions
 */
function completeFormatDate(dateAsString: string) {
  const datePrefix = getLocalizedOrDefaultLabel(
    'notifications',
    'detail.downtimes.datePrefix',
    'il '
  );
  return `${isToday(new Date(dateAsString)) ? '' : datePrefix} ${formatDate(dateAsString)}`;
}

function mainTextForDowntime(downtime: Downtime) {
  // beware! - tests rely on the default texts
  return downtime.endDate
    ? getLocalizedOrDefaultLabel(
        'notifications',
        'detail.downtimes.textWithEndDate',
        `Disservizio dal ${downtime.startDate} al ${downtime.endDate}`,
        {
          startDate: completeFormatDate(downtime.startDate),
          endDate: completeFormatDate(downtime.endDate),
        }
      )
    : getLocalizedOrDefaultLabel(
        'notifications',
        'detail.downtimes.textWithoutEndDate',
        `Disservizio iniziato il ${downtime.startDate}`,
        { startDate: completeFormatDate(downtime.startDate) }
      );
}

const NotificationRelatedDowntimes: React.FC<Props> = ({
  notificationStatusHistory,
  fetchDowntimeEvents,
  downtimeEvents,
  fetchDowntimeLegalFactDocumentDetails,
  apiId,
  disableDownloads,
  downtimeExampleLink,
}) => {
  const theme = useTheme();

  const title = getLocalizedOrDefaultLabel('notifications', 'detail.downtimes.title', 'DISSERVIZI');
  const unknownFunctinalityLabel = (event: Downtime) =>
    getLocalizedOrDefaultLabel('appStatus', `legends.unknownFunctionality`, undefined, {
      functionality: event.functionality,
    });

  const [shouldFetchEvents, setShouldFetchEvents] = useState<boolean>(false);

  /*
   * Decide whether the events are to be obtained, in such case it determines the time range
   * and launches the fetch. The following rules apply, they are meant to be considered in order.
   *
   * - if the notification was cancelled, i.e. there is a CANCELLED event in its status history,
   *   then the downtime information should not appear.
   * - if there is no ACCEPTED event in the status history, then the downtime information should not appear.
   * - if the earlier between the EFFECTIVE_DATE, VIEWED or UNREACHABLE events
   *   is before the ACCEPTED event, then the downtime information should not appear.
   * - if no EFFECTIVE_DATE or VIEWED events are present, then
   *   the downtime events between the ACCEPTED event and the current date/time must be shown.
   * - otherwise, i.e. if the earlier between the EFFECTIVE_DATE, VIEWED or UNREACHABLE events is after
   *   the ACCEPTED event, then the downtime events between the ACCEPTED event
   *   and the earlier between the EFFECTIVE_DATE, VIEWED or UNREACHABLE events must be shown.
   */
  const doFetchEvents = useCallback(() => {
    const acceptedRecord = notificationStatusHistory.find(
      (record) => record.status === NotificationStatus.ACCEPTED
    );
    const effectiveDateRecord = notificationStatusHistory.find(
      (record) => record.status === NotificationStatus.EFFECTIVE_DATE
    );
    const viewedRecord = notificationStatusHistory.find(
      (record) => record.status === NotificationStatus.VIEWED
    );
    const unreachableRecord = notificationStatusHistory.find(
      (record) => record.status === NotificationStatus.UNREACHABLE
    );
    const cancelledRecord = notificationStatusHistory.find(
      (record) => record.status === NotificationStatus.CANCELLED
    );

    // the earlier between VIEWED, EFFECTIVE_DATE and UNREACHABLE
    const viewedOrEffectiveDateRecord =
      effectiveDateRecord && viewedRecord
        ? effectiveDateRecord.activeFrom < viewedRecord.activeFrom
          ? effectiveDateRecord
          : viewedRecord
        : effectiveDateRecord || viewedRecord;
    const completedRecord =
      viewedOrEffectiveDateRecord && unreachableRecord
        ? viewedOrEffectiveDateRecord.activeFrom < unreachableRecord.activeFrom
          ? viewedOrEffectiveDateRecord
          : unreachableRecord
        : viewedOrEffectiveDateRecord || unreachableRecord;

    const invalidStatusHistory =
      cancelledRecord ||
      !acceptedRecord ||
      (acceptedRecord && completedRecord && acceptedRecord.activeFrom > completedRecord.activeFrom);

    if (invalidStatusHistory || !acceptedRecord) {
      setShouldFetchEvents(false);
      return;
    }

    setShouldFetchEvents(true);

    fetchDowntimeEvents(
      acceptedRecord.activeFrom,
      completedRecord?.activeFrom || new Date().toISOString()
    );
  }, [notificationStatusHistory]);

  useEffect(() => doFetchEvents(), [doFetchEvents]);

  return (
    <ApiErrorWrapper
      apiId={apiId}
      reloadAction={doFetchEvents}
      mainText={getLocalizedOrDefaultLabel(
        'notifications',
        'detail.downtimes.apiErrorMessage',
        'Errore API'
      )}
    >
      {shouldFetchEvents && downtimeEvents.length > 0 ? (
        <Paper sx={{ p: 3, mb: 3 }} elevation={0} data-testid="downtimesBox">
          <Grid
            key={'downtimes-section'}
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            data-testid="notification-related-downtimes-main"
          >
            <Grid key={'downtimes-section-title'} item sx={{ mb: 1 }}>
              <Typography
                color="text.primary"
                variant="overline"
                fontWeight={700}
                textTransform="uppercase"
                fontSize={14}
              >
                {title}
              </Typography>
            </Grid>
          </Grid>

          {getSessionLanguage() !== 'it' && (
            <DowntimeLanguageBanner downtimeExampleLink={downtimeExampleLink} />
          )}

          <Grid key={'detail-documents-message'} item>
            <Stack direction="column">
              {/* Render each downtime event */}
              {downtimeEvents.map((event, ix) => (
                <Stack
                  key={ix}
                  direction="column"
                  alignItems="flex-start"
                  data-testid="notification-related-downtime-detail"
                  sx={{
                    mt: 3,
                    borderBottomColor: 'divider',
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '3px',
                  }}
                >
                  {/* Description including time range */}
                  <Typography variant="body2">{mainTextForDowntime(event)}</Typography>

                  {/* Target functionalities */}
                  <ul>
                    <li style={{ marginTop: '-12px' }}>
                      <Typography variant="body2">
                        {getLocalizedOrDefaultLabel(
                          'appStatus',
                          `legends.knownFunctionality.${event.functionality}`,
                          unknownFunctinalityLabel(event)
                        )}
                      </Typography>
                    </li>
                  </ul>

                  {/* Link to download related file, or message about non-availability of such file */}
                  {/* beware! - tests rely on the default texts */}
                  <Box sx={{ mb: 3, ml: 2 }}>
                    {event.fileAvailable ? (
                      <ButtonNaked
                        sx={{ px: 0 }}
                        color="primary"
                        startIcon={<AttachFileIcon />}
                        onClick={() => {
                          void fetchDowntimeLegalFactDocumentDetails(event.legalFactId as string);
                        }}
                        disabled={disableDownloads}
                      >
                        {getLocalizedOrDefaultLabel(
                          'notifications',
                          'detail.downtimes.legalFactDownload',
                          'Scaricare'
                        )}
                      </ButtonNaked>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}
                      >
                        {getLocalizedOrDefaultLabel(
                          'appStatus',
                          `legends.noFileAvailableByStatus.${event.status}`,
                          'File non disponibile'
                        )}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Paper>
      ) : (
        <></>
      )}
    </ApiErrorWrapper>
  );
};

export default NotificationRelatedDowntimes;
