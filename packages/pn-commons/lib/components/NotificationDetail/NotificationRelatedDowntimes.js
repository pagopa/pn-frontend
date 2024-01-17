import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useDownloadDocument } from '../../hooks';
import { NotificationStatus } from '../../models';
import { formatDate, isToday } from '../../utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import ApiErrorWrapper from '../ApiError/ApiErrorWrapper';
/*
 * Some auxiliary functions
 */
function completeFormatDate(dateAsString) {
    const datePrefix = getLocalizedOrDefaultLabel('notifications', 'detail.downtimes.datePrefix', 'il ');
    return `${isToday(new Date(dateAsString)) ? '' : datePrefix} ${formatDate(dateAsString)}`;
}
function mainTextForDowntime(downtime) {
    // beware! - tests rely on the default texts
    return downtime.endDate
        ? getLocalizedOrDefaultLabel('notifications', 'detail.downtimes.textWithEndDate', `Disservizio dal ${downtime.startDate} al ${downtime.endDate}`, {
            startDate: completeFormatDate(downtime.startDate),
            endDate: completeFormatDate(downtime.endDate),
        })
        : getLocalizedOrDefaultLabel('notifications', 'detail.downtimes.textWithoutEndDate', `Disservizio iniziato il ${downtime.startDate}`, { startDate: completeFormatDate(downtime.startDate) });
}
/*
 * The component!
 * ****************************************************************** */
const NotificationRelatedDowntimes = (props) => {
    const theme = useTheme();
    const title = getLocalizedOrDefaultLabel('notifications', 'detail.downtimes.title', 'DISSERVIZI');
    const [shouldFetchEvents, setShouldFetchEvents] = useState(false);
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
        const acceptedRecord = props.notificationStatusHistory.find((record) => record.status === NotificationStatus.ACCEPTED);
        const effectiveDateRecord = props.notificationStatusHistory.find((record) => record.status === NotificationStatus.EFFECTIVE_DATE);
        const viewedRecord = props.notificationStatusHistory.find((record) => record.status === NotificationStatus.VIEWED);
        const unreachableRecord = props.notificationStatusHistory.find((record) => record.status === NotificationStatus.UNREACHABLE);
        const cancelledRecord = props.notificationStatusHistory.find((record) => record.status === NotificationStatus.CANCELLED);
        // the earlier between VIEWED, EFFECTIVE_DATE and UNREACHABLE
        const viewedOrEffectiveDateRecord = effectiveDateRecord && viewedRecord
            ? effectiveDateRecord.activeFrom < viewedRecord.activeFrom
                ? effectiveDateRecord
                : viewedRecord
            : effectiveDateRecord || viewedRecord;
        const completedRecord = viewedOrEffectiveDateRecord && unreachableRecord
            ? viewedOrEffectiveDateRecord.activeFrom < unreachableRecord.activeFrom
                ? viewedOrEffectiveDateRecord
                : unreachableRecord
            : viewedOrEffectiveDateRecord || unreachableRecord;
        const invalidStatusHistory = cancelledRecord ||
            !acceptedRecord ||
            (acceptedRecord && completedRecord && acceptedRecord.activeFrom > completedRecord.activeFrom);
        if (invalidStatusHistory || !acceptedRecord) {
            setShouldFetchEvents(false);
        }
        else {
            setShouldFetchEvents(true);
            props.fetchDowntimeEvents(acceptedRecord.activeFrom, completedRecord?.activeFrom || new Date().toISOString());
        }
    }, [props.notificationStatusHistory]);
    useEffect(() => doFetchEvents(), [doFetchEvents]);
    return (_jsx(ApiErrorWrapper, { apiId: props.apiId, reloadAction: doFetchEvents, mainText: getLocalizedOrDefaultLabel('notifications', 'detail.downtimes.apiErrorMessage', 'Errore API'), children: shouldFetchEvents && props.downtimeEvents.length > 0 ? (_jsxs(Paper, { sx: { p: 3, mb: 3 }, elevation: 0, "data-testid": "downtimesBox", children: [_jsx(Grid, { container: true, direction: "row", justifyContent: "space-between", alignItems: "center", "data-testid": "notification-related-downtimes-main", children: _jsx(Grid, { item: true, sx: { mb: 1 }, children: _jsx(Typography, { color: "text.primary", variant: "overline", fontWeight: 700, textTransform: "uppercase", fontSize: 14, children: title }) }, 'downtimes-section-title') }, 'downtimes-section'), _jsx(Grid, { item: true, children: _jsx(Stack, { direction: "column", children: props.downtimeEvents.map((event, ix) => (_jsxs(Stack, { direction: "column", alignItems: "flex-start", "data-testid": "notification-related-downtime-detail", sx: {
                                mt: 3,
                                borderBottomColor: 'divider',
                                borderBottomStyle: 'solid',
                                borderBottomWidth: '3px',
                            }, children: [_jsx(Typography, { variant: "body2", children: mainTextForDowntime(event) }), _jsx("ul", { children: _jsx("li", { style: { marginTop: '-12px' }, children: _jsx(Typography, { variant: "body2", children: event.knownFunctionality
                                                ? getLocalizedOrDefaultLabel('appStatus', `legends.knownFunctionality.${event.knownFunctionality}`, event.knownFunctionality)
                                                : getLocalizedOrDefaultLabel('appStatus', 'legends.unknownFunctionality', 'Un servizio sconosciuto', { functionality: event.rawFunctionality }) }) }) }), _jsx(Box, { sx: { mb: 3, ml: 2 }, children: event.fileAvailable ? (_jsx(ButtonNaked, { sx: { px: 0 }, color: "primary", startIcon: _jsx(AttachFileIcon, {}), onClick: () => {
                                            void props.fetchDowntimeLegalFactDocumentDetails(event.legalFactId);
                                        }, disabled: props.disableDownloads, children: getLocalizedOrDefaultLabel('notifications', 'detail.downtimes.legalFactDownload', 'Scaricare') })) : (_jsx(Typography, { variant: "body2", sx: { color: theme.palette.text.secondary, fontSize: '0.875rem' }, children: getLocalizedOrDefaultLabel('appStatus', `legends.noFileAvailableByStatus.${event.status}`, 'File non disponibile') })) })] }, ix))) }) }, 'detail-documents-message')] })) : (_jsx(_Fragment, {})) }));
};
export default NotificationRelatedDowntimes;
