import { jsx as _jsx } from "react/jsx-runtime";
import { Children, isValidElement } from 'react';
import { Box, CardActions } from '@mui/material';
const PnCardActions = ({ testId, disableSpacing = true, children, }) => (_jsx(CardActions, { disableSpacing: disableSpacing, "data-testid": testId, className: 'card-actions', children: Children.map(children, (child) => isValidElement(child) ? (_jsx(Box, { sx: { ml: 'auto' }, children: child }, child.key)) : (child)) }));
export default PnCardActions;
