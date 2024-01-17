import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useFieldSpecs } from '../../hooks/useFieldSpecs';
import PnCard from '../Data/PnCard/PnCard';
import PnCardContent from '../Data/PnCard/PnCardContent';
import PnCardContentItem from '../Data/PnCard/PnCardContentItem';
import PnCardHeader from '../Data/PnCard/PnCardHeader';
import PnCardHeaderItem from '../Data/PnCard/PnCardHeaderItem';
import PnCardsList from '../Data/PnCardsList';
import DowntimeLogDataSwitch from './DowntimeLogDataSwitch';
const MobileDowntimeLog = ({ downtimeLog, getDowntimeLegalFactDocumentDetails, handleTrackDownloadCertificateOpposable3dparties, }) => {
    const fieldSpecs = useFieldSpecs();
    const { getField, getRows } = fieldSpecs;
    const cardHeader = useMemo(() => getField('status'), [getField]);
    const cardBody = useMemo(() => [
        {
            ...getField('startDate'),
            wrapValueInTypography: false,
        },
        {
            ...getField('endDate'),
            wrapValueInTypography: false,
        },
        getField('knownFunctionality'),
        { ...getField('legalFactId'), wrapValueInTypography: false },
    ], [getField]);
    const rows = getRows(downtimeLog);
    return (_jsx(PnCardsList, { testId: "mobileTableDowntimeLog", children: rows.map((row) => (_jsxs(PnCard, { testId: "mobileTableDowntimeLog.cards", children: [_jsx(PnCardHeader, { children: _jsx(PnCardHeaderItem, { gridProps: cardHeader.gridProps, testId: 'cardHeaderLeft', children: _jsx(DowntimeLogDataSwitch, { data: row, type: cardHeader.id, inTwoLines: true, getDowntimeLegalFactDocumentDetails: getDowntimeLegalFactDocumentDetails }) }, cardHeader.id) }), _jsx(PnCardContent, { children: cardBody.map((body) => (_jsx(PnCardContentItem, { wrapValueInTypography: body.wrapValueInTypography, label: body.label, testId: "cardBody", children: _jsx(DowntimeLogDataSwitch, { data: row, type: body.id, inTwoLines: false, getDowntimeLegalFactDocumentDetails: getDowntimeLegalFactDocumentDetails, handleTrackDownloadCertificateOpposable3dparties: handleTrackDownloadCertificateOpposable3dparties }) }, body.id))) })] }, row.id))) }));
};
export default MobileDowntimeLog;
