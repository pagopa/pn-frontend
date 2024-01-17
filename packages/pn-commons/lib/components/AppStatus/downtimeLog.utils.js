import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Button, Chip, Stack, Typography, useTheme } from '@mui/material';
import { DowntimeStatus } from '../../models';
import { formatDate, formatDateTime, formatTimeWithLegend } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
export function booleanStringToBoolean(booleanString) {
    return booleanString.toLowerCase() === 'true';
}
/* eslint-disable-next-line arrow-body-style */
const FormattedDateAndTime = ({ date, inTwoLines }) => {
    if (date) {
        return inTwoLines ? (_jsxs(Stack, { direction: "column", children: [_jsxs(Typography, { variant: "body2", children: [formatDate(date), ","] }), _jsx(Typography, { variant: "body2", children: formatTimeWithLegend(date) })] })) : (_jsx(Typography, { variant: "body2", id: "dateDisservizio", children: formatDateTime(date) }));
    }
    return (_jsx(Typography, { variant: "body2", id: "dateNull", children: "-" }));
};
export function adaptFieldSpecToMobile(desktopFieldSpec) {
    return {
        id: desktopFieldSpec.id,
        label: desktopFieldSpec.label,
        getLabel: desktopFieldSpec.getCellLabel,
    };
}
export function useFieldSpecs({ getDowntimeLegalFactDocumentDetails, }) {
    const theme = useTheme();
    const getDateFieldSpec = useCallback((fieldId, inTwoLines) => ({
        id: fieldId,
        label: getLocalizedOrDefaultLabel('appStatus', `downtimeList.columnHeader.${fieldId}`, `Data ${fieldId}`),
        sortable: false,
        getCellLabel(value) {
            return _jsx(FormattedDateAndTime, { date: value, inTwoLines: inTwoLines });
        },
    }), []);
    const getFunctionalityFieldSpec = useCallback(() => ({
        label: getLocalizedOrDefaultLabel('appStatus', 'downtimeList.columnHeader.functionality', 'Servizio coinvolto'),
        sortable: false,
        id: 'functionality',
        getCellLabel(_, i) {
            return i.knownFunctionality
                ? getLocalizedOrDefaultLabel('appStatus', `legends.knownFunctionality.${i.knownFunctionality}`, 'Nome del servizio ben conosciuto')
                : getLocalizedOrDefaultLabel('appStatus', 'legends.unknownFunctionality', 'Un servizio sconosciuto', { functionality: i.rawFunctionality });
        },
    }), []);
    const getLegalFactIdFieldSpec = useCallback(() => ({
        id: 'legalFactId',
        label: getLocalizedOrDefaultLabel('appStatus', 'downtimeList.columnHeader.legalFactId', 'Attestazione'),
        sortable: false,
        getCellLabel(_, i) {
            if (booleanStringToBoolean(i.fileAvailable)) {
                return (_jsx(Button, { sx: { px: 0 }, startIcon: _jsx(DownloadIcon, {}), "data-testid": "download-legal-fact", onClick: () => {
                        void getDowntimeLegalFactDocumentDetails(i.legalFactId);
                    }, children: getLocalizedOrDefaultLabel('appStatus', 'legends.legalFactDownload', 'Scaricare') }));
            }
            else {
                return (_jsx(Typography, { variant: "body2", sx: { color: theme.palette.text.secondary }, children: getLocalizedOrDefaultLabel('appStatus', `legends.noFileAvailableByStatus.${i.status}`, 'Non si può ancora scaricare') }));
            }
        },
    }), []);
    const getStatusFieldSpec = useCallback(() => ({
        id: 'status',
        label: getLocalizedOrDefaultLabel('appStatus', 'downtimeList.columnHeader.status', 'Stato'),
        sortable: false,
        getCellLabel(value) {
            return (_jsx(Chip, { id: "downTimeStatus", "data-testid": "downtime-status", label: getLocalizedOrDefaultLabel('appStatus', `legends.status.${value}`, 'Status'), sx: {
                    backgroundColor: value === DowntimeStatus.OK
                        ? theme.palette.success.light
                        : theme.palette.error.light,
                } }));
        },
    }), []);
    const getRows = useCallback((downtimeLog) => downtimeLog.downtimes.map((n, i) => ({
        ...n,
        fileAvailable: n.fileAvailable ? 'true' : 'false',
        id: n.startDate + i.toString(),
    })), []);
    return {
        getDateFieldSpec,
        getFunctionalityFieldSpec,
        getLegalFactIdFieldSpec,
        getStatusFieldSpec,
        getRows,
    };
}
