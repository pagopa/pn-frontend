import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
/**
 * Table with the details of a notification
 * @param rows data to show
 */
const NotificationDetailTable = ({ children, rows }) => (_jsxs(TableContainer, { component: Paper, sx: { px: 3, py: { xs: 3, lg: 2 } }, elevation: 0, id: "notification-detail", "data-testid": "detailTable", children: [_jsx(Table, { id: "notification-detail-table", "aria-label": getLocalizedOrDefaultLabel('notifications', 'detail.table-aria-label', 'Dettaglio notifica'), "data-testid": "notificationDetailTable", children: _jsx(TableBody, { children: rows.map((row) => (_jsxs(TableRow, { sx: {
                        '& td': { border: 'none' },
                        verticalAlign: 'top',
                        display: { xs: 'flex', lg: 'table-row' },
                        flexDirection: { xs: 'column', lg: 'row' },
                    }, "data-testid": "notificationDetailTableRow", children: [_jsx(TableCell, { id: `row-label-${row.id}`, padding: "none", sx: { py: { xs: 0, lg: 1 } }, children: row.label }), _jsx(TableCell, { id: `row-value-${row.id}`, padding: "none", sx: { pb: 1, pt: { xs: 0, lg: 1 } }, children: row.value })] }, row.id))) }) }), children] }));
export default NotificationDetailTable;
