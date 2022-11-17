import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  ApiErrorWrapper, EmptyState, TitleBox, useIsMobile, KnownFunctionality, 
  AppStatusBar, DesktopDowntimeLog, MobileDowntimeLog, formatDateTime, PaginationData, GetDowntimeHistoryParams, CustomPagination 
} from '@pagopa-pn/pn-commons';
import { APP_STATUS_ACTIONS, getCurrentAppStatus, getDowntimeLegalFactDocumentDetails, getDowntimeLogPage } from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { clearPagination, setPagination } from '../redux/appStatus/reducers';
import { useDownloadDocument } from './components/AppStatus/useDownloadDocument';


/* eslint-disable-next-line arrow-body-style */
const AppStatus = () => {
  const dispatch = useAppDispatch();
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const downtimeLog = useAppSelector((state: RootState) => state.appStatus.downtimeLogPage);
  const paginationData = useAppSelector((state: RootState) => state.appStatus.pagination);
  const [isInitialized, setIsInitialized] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation(['appStatus']);
  useDownloadDocument();

  const fetchCurrentStatus = useCallback(() => {
    void dispatch(getCurrentAppStatus());
  }, [dispatch, getCurrentAppStatus]);

  const fetchDowntimeLog = useCallback(() => {
    const fetchParams: GetDowntimeHistoryParams = { 
      startDate: "1900-01-01T00:00:00Z",
      functionality: [KnownFunctionality.NotificationCreate, KnownFunctionality.NotificationVisualization, KnownFunctionality.NotificationWorkflow],
      size: String(paginationData.size),
      page: paginationData.resultPages[paginationData.page],
    };
    void dispatch(getDowntimeLogPage(fetchParams));
  }, [dispatch, getDowntimeLogPage, paginationData.page, paginationData.size]);

  const fetchDowntimeLegalFactDocumentDetails = useCallback(
    (legalFactId: string) => void dispatch(getDowntimeLegalFactDocumentDetails(legalFactId)), 
  [dispatch, getDowntimeLegalFactDocumentDetails]);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(clearPagination());
      setIsInitialized(true);
    }
  }, [isInitialized]);

  /*
   * whenever fetchDowntimeLog changes (e.g. when pagination parameters change)
   * I decide to perform the status API call along with that fo the downtime log
   * to bring the user status information as updated as possible.
   * -------------------------------
   * Carlos Lombardi, 2022.11.11
   */
  useEffect(() => {
    if (isInitialized) {
      fetchCurrentStatus();
      fetchDowntimeLog();
    }
  }, [fetchCurrentStatus, fetchDowntimeLog, isInitialized]);

  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  const lastCheckTimestampFormatted = useMemo(() => {
    if (currentStatus) {
      const dateAndTime = formatDateTime(currentStatus.lastCheckTimestamp);
      return `${dateAndTime.date}, ${dateAndTime.time}`;
    } else {
      return "";
    }
  }, [currentStatus]);

  // resultPages includes one element per page, *including the first page*
  // check the comments in the reducer
  const totalElements = paginationData.size * paginationData.resultPages.length;
  // paginagion will show just a single page number, along with the arrows
  // because the lookup size of the API is just one, there is no (easy) way to know 
  // whether there is more than one page forward
  const pagesToShow = [paginationData.page + 1];    

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
            <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
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
        { downtimeLog && downtimeLog.downtimes.length > 0 && 
          <CustomPagination
            paginationData={{
              size: paginationData.size,
              page: paginationData.page,
              totalElements,
            }}
            onPageRequest={handleChangePage}
            pagesToShow={pagesToShow}
          />        
        }
      </ApiErrorWrapper>
    </Stack>
  </Box>;
};

export default AppStatus;
