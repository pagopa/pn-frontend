import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useFieldSpecs } from '../../hooks/useFieldSpecs';
import PnTable from '../Data/PnTable';
import PnTableBody from '../Data/PnTable/PnTableBody';
import PnTableBodyCell from '../Data/PnTable/PnTableBodyCell';
import PnTableBodyRow from '../Data/PnTable/PnTableBodyRow';
import PnTableHeader from '../Data/PnTable/PnTableHeader';
import PnTableHeaderCell from '../Data/PnTable/PnTableHeaderCell';
import DowntimeLogDataSwitch from './DowntimeLogDataSwitch';
const DesktopDowntimeLog = ({ downtimeLog, getDowntimeLegalFactDocumentDetails, handleTrackDownloadCertificateOpposable3dparties, }) => {
    const fieldSpecs = useFieldSpecs();
    const { getField, getRows } = fieldSpecs;
    const columns = useMemo(() => [
        {
            ...getField('startDate'),
            cellProps: { width: '15%' },
        },
        {
            ...getField('endDate'),
            cellProps: { width: '15%' },
        },
        {
            ...getField('knownFunctionality'),
            cellProps: { width: '30%' },
        },
        {
            ...getField('legalFactId'),
            cellProps: { width: '30%' },
        },
        {
            ...getField('status'),
            cellProps: { width: '15%' },
        },
    ], [getField]);
    const rows = getRows(downtimeLog);
    return (_jsxs(PnTable, { testId: "tableDowntimeLog", children: [_jsx(PnTableHeader, { children: columns.map((column) => (_jsx(PnTableHeaderCell, { columnId: column.id, sortable: column.sortable, testId: "tableDowntimeLog.header.cell", children: column.label }, column.id))) }), _jsx(PnTableBody, { children: rows.map((row, index) => (_jsx(PnTableBodyRow, { index: index, testId: "tableDowntimeLog.row", children: columns.map((column) => (_jsx(PnTableBodyCell, { cellProps: column.cellProps, testId: "tableDowntimeLog.row.cell", children: _jsx(DowntimeLogDataSwitch, { data: row, type: column.id, inTwoLines: true, getDowntimeLegalFactDocumentDetails: getDowntimeLegalFactDocumentDetails, handleTrackDownloadCertificateOpposable3dparties: handleTrackDownloadCertificateOpposable3dparties }) }, column.id))) }, row.id))) })] }));
};
export default DesktopDowntimeLog;
