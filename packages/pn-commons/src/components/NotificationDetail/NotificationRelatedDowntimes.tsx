import { useCallback, useEffect, useState } from 'react';
import { Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ButtonNaked } from '@pagopa/mui-italia';
import { NotificationStatus, NotificationStatusHistory } from '../../types';
import { Downtime } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { formatDate, isToday } from '../../utils';
import { useDownloadDocument } from '../../hooks';
import ApiErrorWrapper from '../ApiError/ApiErrorWrapper';

type Props = {
  // the notification history, needed to compute the time range for the downtime events query
  notificationStatusHistory: Array<NotificationStatusHistory>;

  // action to obtain and set the downtime events to be shown ...
  fetchDowntimeEvents: (fromDate: string, toDate: string | undefined) => void;

  // ... so that such events are passed throught this prop
  downtimeEvents: Array<Downtime>;

  // action to obtain and set the legal fact document url ...
  fetchDowntimeLegalFactDocumentDetails: (legalFactId: string) => void;

  // ... so that it is passed throught this prop ...
  downtimeLegalFactUrl: string;

  // ... and afterwards can be cleaned using this prop
  clearDowntimeLegalFactData: () => void;

  // api id for ApiErrorWrapper
  apiId: string;
};


/*
 * Some auxiliary functions
 */

function completeFormatDate(dateAsString: string) {
  const datePrefix = getLocalizedOrDefaultLabel(
    'notifications',
    'detail.downtimes.datePrefix',
    'il ',
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
      { startDate: completeFormatDate(downtime.startDate), endDate: completeFormatDate(downtime.endDate) }
    ) : getLocalizedOrDefaultLabel(
      'notifications',
      'detail.downtimes.textWithoutEndDate',
      `Disservizio iniziato il ${downtime.startDate}`,
      { startDate: completeFormatDate(downtime.startDate) }
    );
}


/*
 * The component!
 * ****************************************************************** */
const NotificationRelatedDowntimes = (props: Props) => {
  const theme = useTheme();

  const title = getLocalizedOrDefaultLabel(
    'notifications',
    'detail.downtimes.title',
    'DISSERVIZI'
  );

  const [shouldFetchEvents, setShouldFetchEvents] = useState<boolean>(false); 

  useDownloadDocument({
    url: props.downtimeLegalFactUrl,
    clearDownloadAction: props.clearDowntimeLegalFactData,
  });

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
    const acceptedRecord = props.notificationStatusHistory.find(record => 
      record.status === NotificationStatus.ACCEPTED
    );
    const effectiveDateRecord = props.notificationStatusHistory.find(record => 
      record.status === NotificationStatus.EFFECTIVE_DATE
    );
    const viewedRecord = props.notificationStatusHistory.find(record => 
      record.status === NotificationStatus.VIEWED
    );
    const unreachableRecord = props.notificationStatusHistory.find(record => 
      record.status === NotificationStatus.UNREACHABLE
    );
    const cancelledRecord = props.notificationStatusHistory.find(record => 
      record.status === NotificationStatus.CANCELLED
    );

    // the earlier between VIEWED, EFFECTIVE_DATE and UNREACHABLE
    const viewedOrEffectiveDateRecord =
      effectiveDateRecord && viewedRecord 
        ? (effectiveDateRecord.activeFrom < viewedRecord.activeFrom ? effectiveDateRecord : viewedRecord)
        : (effectiveDateRecord || viewedRecord); 
    const completedRecord = 
      viewedOrEffectiveDateRecord && unreachableRecord 
        ? (viewedOrEffectiveDateRecord.activeFrom < unreachableRecord.activeFrom ? viewedOrEffectiveDateRecord : unreachableRecord)
        : (viewedOrEffectiveDateRecord || unreachableRecord); 

    const invalidStatusHistory = cancelledRecord || !acceptedRecord  
      || (acceptedRecord && completedRecord && acceptedRecord.activeFrom > completedRecord.activeFrom);
    if (invalidStatusHistory || !acceptedRecord) {
      setShouldFetchEvents(false);
    } else {
      setShouldFetchEvents(true);
      props.fetchDowntimeEvents(acceptedRecord.activeFrom, completedRecord?.activeFrom || new Date().toISOString());
    }
  }, [props.notificationStatusHistory]);

  useEffect(() => doFetchEvents(), [doFetchEvents]);

  return <ApiErrorWrapper apiId={props.apiId} reloadAction={doFetchEvents} mainText={getLocalizedOrDefaultLabel(
    'notifications',
    'detail.downtimes.apiErrorMessage',
    'Errore API'
  )}>
    {
      shouldFetchEvents && props.downtimeEvents.length > 0 ? <Paper sx={{ p: 3, mb: 3 }} className="paperContainer">
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
        <Grid key={'detail-documents-message'} item>
          <Stack direction="column">

            {/* Render each downtime event */}
            {props.downtimeEvents.map((event, ix) => <Stack key={ix} direction="column" alignItems="flex-start" data-testid="notification-related-downtime-detail" sx={{ 
              mt: 3, borderBottomColor: 'divider', borderBottomStyle: 'solid', borderBottomWidth: '3px',
            }}>

              {/* Description including time range */}
              <Typography variant="body2">
                {mainTextForDowntime(event)}
              </Typography>

              {/* Target functionalities */}
              <ul>
                <li style={{ marginTop: "-12px" }}>
                  <Typography variant="body2">{
                    event.knownFunctionality 
                      ? getLocalizedOrDefaultLabel(
                          'appStatus',
                          `legends.knownFunctionality.${event.knownFunctionality}`,
                          event.knownFunctionality
                        )
                      : getLocalizedOrDefaultLabel(
                          'appStatus',
                          'legends.unknownFunctionality',
                          'Un servizio sconosciuto',
                          { functionality: event.rawFunctionality }
                        )
                  }</Typography>
                </li>
              </ul>

              {/* Link to download related file, or message about non-availability of such file */}
              {/* beware! - tests rely on the default texts */}
              <Box sx={{ mb: 3, ml: 2 }}>
                {event.fileAvailable ?
                  <ButtonNaked
                    sx={{ px: 0 }}
                    color='primary'
                    startIcon={<AttachFileIcon />}
                    onClick={() => {
                      void props.fetchDowntimeLegalFactDocumentDetails(event.legalFactId as string);
                    }}
                  >
                    {getLocalizedOrDefaultLabel(
                      'notifications',
                      'detail.downtimes.legalFactDownload',
                      'Scaricare'
                    )}
                  </ButtonNaked>
                :
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.875rem" }}>
                    {getLocalizedOrDefaultLabel(
                      'appStatus',
                      `legends.noFileAvailableByStatus.${event.status}`,
                      'File non disponibile'
                    )}
                  </Typography>
                }
              </Box>

            </Stack>)}
          </Stack>
        </Grid>
      </Paper>
      : <></>
    }
  </ApiErrorWrapper>;
};

export default NotificationRelatedDowntimes;
