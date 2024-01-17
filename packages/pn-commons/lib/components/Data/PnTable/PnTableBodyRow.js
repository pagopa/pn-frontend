import { jsx as _jsx } from "react/jsx-runtime";
import { TableRow } from '@mui/material';
import checkChildren from '../../../utility/children.utility';
import PnTableBodyCell from './PnTableBodyCell';
const PnTableBodyRow = ({ children, index, testId }) => {
    // check on children
    checkChildren(children, [{ cmp: PnTableBodyCell }], 'PnTableBodyRow');
    return (_jsx(TableRow, { id: testId, "data-testid": testId, role: "row", "aria-rowindex": index + 1, children: children }));
};
export default PnTableBodyRow;
