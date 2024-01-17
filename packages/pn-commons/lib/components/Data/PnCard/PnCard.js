import { jsx as _jsx } from "react/jsx-runtime";
import { Card } from '@mui/material';
import checkChildren from '../../../utility/children.utility';
import PnCardActions from './PnCardActions';
import PnCardContent from './PnCardContent';
import PnCardHeader from './PnCardHeader';
const PnCard = ({ testId = 'itemCard', children }) => {
    // check on children
    checkChildren(children, [
        { cmp: PnCardHeader, maxCount: 1 },
        { cmp: PnCardContent, maxCount: 1, required: true },
        { cmp: PnCardActions, maxCount: 1 },
    ], 'PnCard');
    return (_jsx(Card, { raised: true, "data-testid": testId, sx: {
            mb: 2,
            p: 3,
        }, children: children }));
};
export default PnCard;
