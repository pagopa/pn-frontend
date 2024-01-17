import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from '@mui/material';
import checkChildren from '../../utility/children.utility';
import PnCard from './PnCard/PnCard';
const cardStyle = {
    '& .card-header': {
        padding: 0,
    },
    '& .card-actions': {
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
    },
};
const PnCardsList = ({ sx, testId, children }) => {
    // check on children
    checkChildren(children, [{ cmp: PnCard }], 'PnCardsList');
    return (_jsx(Box, { sx: { ...cardStyle, ...sx }, "data-testid": testId, children: children }));
};
export default PnCardsList;
