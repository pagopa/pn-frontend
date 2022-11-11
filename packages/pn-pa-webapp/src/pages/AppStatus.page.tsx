import { useCallback, useEffect, useMemo } from 'react';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  ApiErrorWrapper, EmptyState, TitleBox, useIsMobile, KnownFunctionality, 
  AppStatusBar, DesktopDowntimeLog, MobileDowntimeLog, formatDateTime 
} from '@pagopa-pn/pn-commons';
import { APP_STATUS_ACTIONS, getCurrentAppStatus, getDowntimeLegalFactDocumentDetails, getDowntimeLogPage } from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { useDownloadDocument } from './components/AppStatus/useDownloadDocument';


/* eslint-disable-next-line arrow-body-style */
const AppStatus = () => {
  const dispatch = useAppDispatch();
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const downtimeLog = useAppSelector((state: RootState) => state.appStatus.downtimeLogPage);
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslation(['appStatus']);
  useDownloadDocument();

  const fetchCurrentStatus = useCallback(() => {
    void dispatch(getCurrentAppStatus());
  }, [dispatch, getCurrentAppStatus]);

  const fetchDowntimeLog = useCallback(() => {
    void dispatch(getDowntimeLogPage({ 
      startDate: "1900-01-01T00:00:00Z",
      functionality: [KnownFunctionality.NotificationCreate, KnownFunctionality.NotificationVisualization, KnownFunctionality.NotificationWorkflow],
    }));
  }, [dispatch, getDowntimeLogPage]);

  const fetchDowntimeLegalFactDocumentDetails = useCallback(
    (legalFactId: string) => void dispatch(getDowntimeLegalFactDocumentDetails(legalFactId)), 
  [dispatch, getDowntimeLegalFactDocumentDetails]);

  useEffect(() => {
    fetchCurrentStatus();
    fetchDowntimeLog();
  }, [fetchCurrentStatus, fetchDowntimeLog]);

  const lastCheckTimestampFormatted = useMemo(() => {
    if (currentStatus) {
      const dateAndTime = formatDateTime(currentStatus.lastCheckTimestamp);
      return `${dateAndTime.date}, ${dateAndTime.time}`;
    } else {
      return "";
    }
  }, [currentStatus]);

  return <Box p={3}>
    <Stack direction="column">

      {/* Titolo status */}
      <TitleBox
        title={t('appStatus.title')} variantTitle='h4'
        subTitle={t('appStatus.subtitle')} variantSubTitle='body1'
      />

      {/* Dati relativi al status */}
      <ApiErrorWrapper apiId={APP_STATUS_ACTIONS.GET_CURRENT_STATUS} reloadAction={() => fetchCurrentStatus()} mt={3}>
        {currentStatus && <AppStatusBar status={currentStatus} />}
        { currentStatus &&
          <Stack direction="row" justifyContent="center">
            <Typography variant="caption" sx={{ mt: 2, color: theme.palette.text.secondary }}>
              { t('appStatus.lastCheckLegend', 
                { lastCheckTimestamp: lastCheckTimestampFormatted })
              }
            </Typography>
          </Stack>
        }
      </ApiErrorWrapper>

      {/* Titolo elenco di downtime */}
      <Typography variant="h6" sx={{ mt: "36px", mb: 2 }}>{t('downtimeList.title')}</Typography>

      {/* Dati relativi al elenco di downtime */}
      <ApiErrorWrapper apiId={APP_STATUS_ACTIONS.GET_DOWNTIME_LOG_PAGE} reloadAction={() => fetchDowntimeLog()} mt={2}>
        { downtimeLog && 
          (downtimeLog.downtimes.length > 0) 
            ? (isMobile 
                ? <Box sx={{ mt: 2 }}>
                    <MobileDowntimeLog downtimeLog={downtimeLog} 
                      getDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails} 
                    />
                  </Box>
                : <DesktopDowntimeLog downtimeLog={downtimeLog} 
                    getDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails} 
                  />
              )
            : <EmptyState disableSentimentDissatisfied enableSentimentSatisfied emptyMessage={t('downtimeList.emptyMessage')} />      
        }
      </ApiErrorWrapper>
    </Stack>
  </Box>;
};

export default AppStatus;
