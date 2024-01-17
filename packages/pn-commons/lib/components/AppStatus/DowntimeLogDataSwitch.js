import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import DownloadIcon from '@mui/icons-material/Download';
import { Button, Chip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DowntimeStatus } from '../../models';
import { formatDate, formatDateTime } from '../../utility';
import { formatTimeWithLegend } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
const FormattedDateAndTime = ({ date, inTwoLines, }) => {
    if (date) {
        return inTwoLines ? (_jsxs(Stack, { direction: "column", children: [_jsxs(Typography, { variant: "body2", children: [formatDate(date), ","] }), _jsx(Typography, { variant: "body2", children: formatTimeWithLegend(date) })] })) : (_jsx(Typography, { variant: "body2", children: formatDateTime(date) }));
    }
    return _jsx(Typography, { variant: "body2", children: "-" });
};
const DowntimeLogDataSwitch = ({ data, type, inTwoLines, getDowntimeLegalFactDocumentDetails, handleTrackDownloadCertificateOpposable3dparties, }) => {
    if (type === 'startDate') {
        return _jsx(FormattedDateAndTime, { date: data.startDate, inTwoLines: inTwoLines });
    }
    if (type === 'endDate') {
        return _jsx(FormattedDateAndTime, { date: data.endDate ?? '', inTwoLines: inTwoLines });
    }
    if (type === 'knownFunctionality') {
        return data.knownFunctionality ? (_jsx(_Fragment, { children: getLocalizedOrDefaultLabel('appStatus', `legends.knownFunctionality.${data.knownFunctionality}`) })) : (_jsx(_Fragment, { children: getLocalizedOrDefaultLabel('appStatus', 'legends.unknownFunctionality', undefined, {
                functionality: data.rawFunctionality,
            }) }));
    }
    if (type === 'legalFactId') {
        return data.fileAvailable ? (_jsx(Button, { sx: { px: 0 }, startIcon: _jsx(DownloadIcon, {}), "data-testid": "download-legal-fact", onClick: () => {
                if (handleTrackDownloadCertificateOpposable3dparties) {
                    handleTrackDownloadCertificateOpposable3dparties();
                }
                void getDowntimeLegalFactDocumentDetails(data.legalFactId);
            }, children: getLocalizedOrDefaultLabel('appStatus', 'legends.legalFactDownload') })) : (_jsx(Typography, { variant: "body2", sx: { color: 'text.secondary' }, children: getLocalizedOrDefaultLabel('appStatus', `legends.noFileAvailableByStatus.${data.status}`) }));
    }
    if (type === 'status') {
        return (_jsx(Chip, { "data-testid": "downtime-status", label: getLocalizedOrDefaultLabel('appStatus', `legends.status.${data.status}`), sx: {
                backgroundColor: data.status === DowntimeStatus.OK ? 'success.light' : 'error.light',
            } }));
    }
    return _jsx(_Fragment, {});
};
export default DowntimeLogDataSwitch;
