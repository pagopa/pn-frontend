import { jsx as _jsx } from "react/jsx-runtime";
import { Children, isValidElement } from 'react';
import { Box, CardContent } from '@mui/material';
import checkChildren from '../../../utility/children.utility';
import PnCardContentItem from './PnCardContentItem';
const PnCardContent = ({ testId, children }) => {
    // check on children
    checkChildren(children, [{ cmp: PnCardContentItem }], 'PnCardContent');
    return (_jsx(CardContent, { "data-testid": testId, sx: { padding: 0, mt: 2, ':last-child': { padding: 0 } }, children: Children.map(children, (child) => isValidElement(child) ? (_jsx(Box, { sx: { mb: 2 }, children: child }, child.key)) : (child)) }));
};
export default PnCardContent;
