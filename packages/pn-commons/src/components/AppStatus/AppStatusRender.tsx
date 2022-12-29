import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  ApiErrorWrapper, EmptyState, TitleBox, useIsMobile, KnownFunctionality, 
  AppStatusBar, DesktopDowntimeLog, MobileDowntimeLog, formatDateTime, CustomPagination, KnownSentiment, useDownloadDocument, 
  GetDowntimeHistoryParams, PaginationData, AppStatusData 
} from '@pagopa-pn/pn-commons';

type Props = {
  appStatus: AppStatusData;
  clearLegalFactDocument: () => void;
  fetchCurrentStatus: () => void;
  fetchDowntimeLogPage: (params: GetDowntimeHistoryParams) => void;
  fetchDowntimeLegalFactDocumentDetails: (legalFactId: string) => undefined;
  clearPagination: () => void;
  setPagination: (data: PaginationData) => void;
  actionIds: { GET_CURRENT_STATUS: string; GET_DOWNTIME_LOG_PAGE: string };
};

export const AppStatusRender = (props: Props) => {
  const { 
    appStatus, actionIds,
    clearLegalFactDocument, fetchCurrentStatus, fetchDowntimeLogPage, clearPagination, setPagination, fetchDowntimeLegalFactDocumentDetails
  } = props;
  const { currentStatus, downtimeLogPage, pagination: paginationData, legalFactDocumentData } = appStatus;
  const [isInitialized, setIsInitialized] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation(['appStatus']);
  useDownloadDocument({ 
    url: legalFactDocumentData && legalFactDocumentData.url, 
    clearDownloadAction: clearLegalFactDocument,
  });

  const fetchDowntimeLog = useCallback(() => {
    const fetchParams: GetDowntimeHistoryParams = { 
      startDate: "1900-01-01T00:00:00Z",
      endDate: new Date().toISOString(),
      functionality: [KnownFunctionality.NotificationCreate, KnownFunctionality.NotificationVisualization, KnownFunctionality.NotificationWorkflow],
      size: String(paginationData.size),
      page: paginationData.resultPages[paginationData.page],
    };
    void fetchDowntimeLogPage(fetchParams);
  }, [fetchDowntimeLogPage, paginationData.page, paginationData.size]);

  useEffect(() => {
    if (!isInitialized) {
      clearPagination();
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
    setPagination(paginationData);
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
  // NB: don't know why, but I needed to add the "as number" cast in order to avoid a compilation error,
  //     even when paginationData.page is recognized as a number - Carlos Lombardi, 2022.12.29
  const pagesToShow = [(paginationData.page as number) + 1];    

  return <Box p={3}>
    <Stack direction="column">

      {/* Titolo status */}
      <TitleBox
        title={t('appStatus.title')} variantTitle='h4'
        subTitle={t('appStatus.subtitle')} variantSubTitle='body1'
      />

      {/* Dati relativi al status */}
      <ApiErrorWrapper apiId={actionIds.GET_CURRENT_STATUS} reloadAction={() => fetchCurrentStatus()} mt={3}>
        {currentStatus && <AppStatusBar status={currentStatus} />}
        { currentStatus &&
          <Stack direction="row" justifyContent="center" data-testid="appStatus-lastCheck">
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
      <ApiErrorWrapper apiId={actionIds.GET_DOWNTIME_LOG_PAGE} reloadAction={() => fetchDowntimeLog()} mt={2}>
        { downtimeLogPage && 
          (downtimeLogPage.downtimes.length > 0) 
            ? (isMobile 
                ? <Box sx={{ mt: 2 }}>
                    <MobileDowntimeLog downtimeLog={downtimeLogPage} 
                      getDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails} 
                    />
                  </Box>
                : <DesktopDowntimeLog downtimeLog={downtimeLogPage} 
                    getDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails} 
                  />
              )
            : <EmptyState sentimentIcon={KnownSentiment.SATISFIED} emptyMessage={t('downtimeList.emptyMessage')} />      
        }
        { downtimeLogPage && downtimeLogPage.downtimes.length > 0 && 
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
