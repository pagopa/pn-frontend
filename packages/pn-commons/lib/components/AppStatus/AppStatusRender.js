import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useDownloadDocument, useIsMobile } from '../../hooks';
import { KnownFunctionality, KnownSentiment, } from '../../models';
import { formatDateTime } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import ApiErrorWrapper from '../ApiError/ApiErrorWrapper';
import EmptyState from '../EmptyState';
import CustomPagination from '../Pagination/CustomPagination';
import TitleBox from '../TitleBox';
import { AppStatusBar } from './AppStatusBar';
import DesktopDowntimeLog from './DesktopDowntimeLog';
import MobileDowntimeLog from './MobileDowntimeLog';
export const AppStatusRender = (props) => {
    const { appStatus, actionIds, clearLegalFactDocument, fetchCurrentStatus, fetchDowntimeLogPage, clearPagination, setPagination, fetchDowntimeLegalFactDocumentDetails, handleTrackDownloadCertificateOpposable3dparties, } = props;
    const { currentStatus, downtimeLogPage, pagination: paginationData, legalFactDocumentData, } = appStatus;
    const [isInitialized, setIsInitialized] = useState(false);
    const isMobile = useIsMobile();
    useDownloadDocument({
        url: legalFactDocumentData?.url,
        clearDownloadAction: clearLegalFactDocument,
    });
    const fetchDowntimeLog = useCallback(() => {
        const fetchParams = {
            startDate: '1900-01-01T00:00:00Z',
            endDate: new Date().toISOString(),
            functionality: [
                KnownFunctionality.NotificationCreate,
                KnownFunctionality.NotificationVisualization,
                KnownFunctionality.NotificationWorkflow,
            ],
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
    const handleChangePage = (paginationData) => {
        setPagination(paginationData);
    };
    const lastCheckTimestampFormatted = () => {
        if (currentStatus) {
            const dateAndTime = formatDateTime(currentStatus.lastCheckTimestamp);
            return `${dateAndTime}`;
        }
        else {
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
    const title = getLocalizedOrDefaultLabel('appStatus', 'appStatus.title', 'Stato della piattaforma');
    const subtitle = getLocalizedOrDefaultLabel('appStatus', 'appStatus.subtitle', 'Verifica lo stato della piattaforma ...');
    const lastCheckLegend = getLocalizedOrDefaultLabel('appStatus', 'appStatus.lastCheckLegend', 'Timestamp ultima verifica', { lastCheckTimestamp: lastCheckTimestampFormatted() });
    const downtimeListTitle = getLocalizedOrDefaultLabel('appStatus', 'downtimeList.title', 'Elenco dei disservizi');
    const downtimeListEmptyMessage = getLocalizedOrDefaultLabel('appStatus', 'downtimeList.emptyMessage', 'Nessun disservizio!');
    return (_jsx(Box, { p: 3, children: _jsxs(Stack, { direction: "column", children: [_jsx(TitleBox, { title: title, variantTitle: "h4", subTitle: subtitle, variantSubTitle: "body1" }), _jsxs(ApiErrorWrapper, { apiId: actionIds.GET_CURRENT_STATUS, reloadAction: () => fetchCurrentStatus(), mt: 3, children: [currentStatus && _jsx(AppStatusBar, { status: currentStatus }), currentStatus && (_jsx(Stack, { direction: "row", justifyContent: "center", "data-testid": "appStatus-lastCheck", id: "appStatusLastCheck", children: _jsx(Typography, { variant: "caption", sx: { mt: 2, color: 'text.secondary' }, tabIndex: 0, "aria-label": lastCheckLegend, children: lastCheckLegend }) }))] }), _jsx(Typography, { variant: "h6", sx: { mt: '36px', mb: 2 }, tabIndex: 0, "aria-label": downtimeListTitle, children: downtimeListTitle }), _jsxs(ApiErrorWrapper, { apiId: actionIds.GET_DOWNTIME_LOG_PAGE, reloadAction: () => fetchDowntimeLog(), mt: 2, children: [downtimeLogPage && downtimeLogPage.downtimes.length > 0 ? (isMobile ? (_jsx(Box, { sx: { mt: 2 }, children: _jsx(MobileDowntimeLog, { downtimeLog: downtimeLogPage, getDowntimeLegalFactDocumentDetails: fetchDowntimeLegalFactDocumentDetails }) })) : (_jsx(DesktopDowntimeLog, { downtimeLog: downtimeLogPage, handleTrackDownloadCertificateOpposable3dparties: handleTrackDownloadCertificateOpposable3dparties, getDowntimeLegalFactDocumentDetails: fetchDowntimeLegalFactDocumentDetails }))) : (_jsx(EmptyState, { sentimentIcon: KnownSentiment.SATISFIED, children: downtimeListEmptyMessage })), downtimeLogPage && downtimeLogPage.downtimes.length > 0 && (_jsx(CustomPagination, { paginationData: {
                                size: paginationData.size,
                                page: paginationData.page,
                                totalElements,
                            }, onPageRequest: handleChangePage, pagesToShow: pagesToShow }))] })] }) }));
};
