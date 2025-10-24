import { useCallback, useEffect, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { useIsMobile } from '../../hooks/useIsMobile';
import { AppStatusData, GetDowntimeHistoryParams } from '../../models/AppStatus';
import { KnownSentiment } from '../../models/EmptyState';
import { PaginationData } from '../../models/Pagination';
import { formatDateTime } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import { getSessionLanguage } from '../../utility/multilanguage.utility';
import ApiErrorWrapper from '../ApiError/ApiErrorWrapper';
import DowntimeLanguageBanner from '../DowntimeLanguageBanner';
import EmptyState from '../EmptyState';
import CustomPagination from '../Pagination/CustomPagination';
import TitleBox from '../TitleBox';
import { AppStatusBar } from './AppStatusBar';
import DesktopDowntimeLog from './DesktopDowntimeLog';
import MobileDowntimeLog from './MobileDowntimeLog';

type Props = {
  appStatus: AppStatusData;
  fetchCurrentStatus: () => void;
  fetchDowntimeLogPage: (params: GetDowntimeHistoryParams) => void;
  fetchDowntimeLegalFactDocumentDetails: (legalFactId: string) => void;
  clearPagination: () => void;
  setPagination: (data: PaginationData) => void;
  actionIds: { GET_CURRENT_STATUS: string; GET_DOWNTIME_HISTORY: string };
  handleTrackDownloadCertificateOpposable3dparties?: () => void;
  downtimeExampleLink: string;
};

export const AppStatusRender: React.FC<Props> = ({
  appStatus,
  actionIds,
  fetchCurrentStatus,
  fetchDowntimeLogPage,
  clearPagination,
  setPagination,
  fetchDowntimeLegalFactDocumentDetails,
  handleTrackDownloadCertificateOpposable3dparties,
  downtimeExampleLink,
}) => {
  const { currentStatus, downtimeLogPage, pagination: paginationData } = appStatus;
  const [isInitialized, setIsInitialized] = useState(false);
  const isMobile = useIsMobile();

  const fetchDowntimeLog = useCallback(() => {
    const fetchParams: GetDowntimeHistoryParams = {
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

  const lastCheckTimestampFormatted = () => {
    if (currentStatus) {
      const dateAndTime = formatDateTime(currentStatus.lastCheckTimestamp);
      return `${dateAndTime}`;
    } else {
      return '';
    }
  };

  // resultPages includes one element per page, *including the first page*
  // check the comments in the reducer
  const totalElements = paginationData.size * paginationData.resultPages.length;
  // paginagion will show just a single page number, along with the arrows
  // because the lookup size of the API is just one, there is no (easy) way to know
  // whether there is more than one page forward
  const pagesToShow = [paginationData.page + 1];

  const title = getLocalizedOrDefaultLabel(
    'appStatus',
    'appStatus.title',
    'Stato della piattaforma'
  );
  const subtitle = getLocalizedOrDefaultLabel(
    'appStatus',
    'appStatus.subtitle',
    'Verifica lo stato della piattaforma ...'
  );
  const lastCheckLegend = getLocalizedOrDefaultLabel(
    'appStatus',
    'appStatus.lastCheckLegend',
    'Timestamp ultima verifica',
    { lastCheckTimestamp: lastCheckTimestampFormatted() }
  );
  const downtimeListTitle = getLocalizedOrDefaultLabel(
    'appStatus',
    'downtimeList.title',
    'Elenco dei disservizi'
  );
  const downtimeListEmptyMessage = getLocalizedOrDefaultLabel(
    'appStatus',
    'downtimeList.emptyMessage',
    'Nessun disservizio!'
  );

  return (
    <Box p={3}>
      <Stack direction="column">
        {/* Titolo status */}
        <TitleBox title={title} variantTitle="h4" subTitle={subtitle} variantSubTitle="body1" />

        {getSessionLanguage() !== 'it' && (
          <DowntimeLanguageBanner downtimeExampleLink={downtimeExampleLink} />
        )}

        {/* Dati relativi al status */}
        <ApiErrorWrapper
          apiId={actionIds.GET_CURRENT_STATUS}
          reloadAction={() => fetchCurrentStatus()}
          mt={3}
        >
          {currentStatus && <AppStatusBar status={currentStatus} />}
          {currentStatus && (
            <Stack
              direction="row"
              justifyContent="center"
              data-testid="appStatus-lastCheck"
              id="appStatusLastCheck"
            >
              <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
                {lastCheckLegend}
              </Typography>
            </Stack>
          )}
        </ApiErrorWrapper>

        {/* Titolo elenco di downtime */}
        <Typography variant="h6" sx={{ mt: '36px', mb: 2 }}>
          {downtimeListTitle}
        </Typography>

        {/* Dati relativi al elenco di downtime */}
        <ApiErrorWrapper
          apiId={actionIds.GET_DOWNTIME_HISTORY}
          reloadAction={() => fetchDowntimeLog()}
          mt={2}
        >
          {downtimeLogPage && downtimeLogPage.result.length > 0 ? (
            isMobile ? (
              <Box sx={{ mt: 2 }}>
                <MobileDowntimeLog
                  downtimeLog={downtimeLogPage}
                  getDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
                />
              </Box>
            ) : (
              <DesktopDowntimeLog
                downtimeLog={downtimeLogPage}
                handleTrackDownloadCertificateOpposable3dparties={
                  handleTrackDownloadCertificateOpposable3dparties
                }
                getDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
              />
            )
          ) : (
            <EmptyState sentimentIcon={KnownSentiment.SATISFIED}>
              {downtimeListEmptyMessage}
            </EmptyState>
          )}
          {downtimeLogPage && downtimeLogPage.result.length > 0 && (
            <CustomPagination
              paginationData={{
                size: paginationData.size,
                page: paginationData.page,
                totalElements,
              }}
              onPageRequest={handleChangePage}
              pagesToShow={pagesToShow}
            />
          )}
        </ApiErrorWrapper>
      </Stack>
    </Box>
  );
};
