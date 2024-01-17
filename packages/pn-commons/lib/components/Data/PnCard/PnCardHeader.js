import { jsx as _jsx } from "react/jsx-runtime";
import { CardHeader, Grid } from '@mui/material';
import checkChildren from '../../../utility/children.utility';
import PnCardHeaderItem from './PnCardHeaderItem';
const PnCardHeader = ({ testId, children, headerGridProps }) => {
    // check on children
    checkChildren(children, [{ cmp: PnCardHeaderItem }], 'PnCardHeader');
    return (_jsx(CardHeader, { "data-testid": testId, className: 'card-header', title: _jsx(Grid, { container: true, spacing: 2, direction: "row", alignItems: "center", ...headerGridProps, children: children }) }));
};
export default PnCardHeader;
