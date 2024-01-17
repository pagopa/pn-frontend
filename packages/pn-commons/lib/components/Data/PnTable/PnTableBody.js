import { jsx as _jsx } from "react/jsx-runtime";
import { TableBody } from '@mui/material';
import checkChildren from '../../../utility/children.utility';
import PnTableBodyRow from './PnTableBodyRow';
const PnTableBody = ({ testId, children }) => {
    // check on children
    checkChildren(children, [{ cmp: PnTableBodyRow }], 'PnTableBody');
    return (_jsx(TableBody, { sx: { backgroundColor: 'background.paper' }, role: "rowgroup", "data-testid": testId, children: children }));
};
export default PnTableBody;
