import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TableCell, TableRow } from '@mui/material';
const CustomTableRow = ({ label, value, dataTestId }) => (_jsxs(TableRow, { sx: {
        paddingBottom: { xs: 2 },
        '& td': { border: 'none' },
        verticalAlign: 'top',
        display: { xs: 'flex', lg: 'table-row' },
        flexDirection: { xs: 'column', lg: 'row' },
    }, "data-testid": dataTestId, children: [_jsx(TableCell, { padding: "none", sx: { py: { lg: 1 } }, "data-testid": "label", children: label }), _jsx(TableCell, { padding: "none", sx: { py: { lg: 1 } }, "data-testid": "value", children: _jsx("b", { children: value || '-' }) })] }));
export default CustomTableRow;
