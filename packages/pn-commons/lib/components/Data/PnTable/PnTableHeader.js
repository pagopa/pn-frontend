import { jsx as _jsx } from "react/jsx-runtime";
import { TableHead, TableRow } from '@mui/material';
import checkChildren from '../../../utility/children.utility';
import PnTableHeaderCell from './PnTableHeaderCell';
const PnTableHeader = ({ testId, children }) => {
    // check on children
    checkChildren(children, [{ cmp: PnTableHeaderCell }], 'PnTableHeader');
    return (_jsx(TableHead, { role: "rowgroup", "data-testid": testId, children: _jsx(TableRow, { role: "row", children: children }) }));
};
export default PnTableHeader;
