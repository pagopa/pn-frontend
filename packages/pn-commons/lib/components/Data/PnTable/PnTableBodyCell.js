import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, TableCell } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { buttonNakedInheritStyle } from '../../../utility';
const PnTableBodyCell = ({ testId, cellProps, children, onClick, }) => (_jsxs(TableCell, { scope: "col", "data-testid": testId, sx: {
        ...cellProps,
        borderBottom: 'none',
    }, onClick: onClick, children: [onClick && (_jsx(_Fragment, { children: _jsx(ButtonNaked, { sx: buttonNakedInheritStyle, children: children }) })), !onClick && _jsx(Box, { children: children })] }));
export default PnTableBodyCell;
