import { jsx as _jsx } from "react/jsx-runtime";
import { Grid } from '@mui/material';
const PnCardHeaderItem = ({ children, gridProps, position = 'left', testId, }) => (_jsx(Grid, { item: true, sx: { textAlign: position, fontSize: '14px', fontWeight: 400 }, "data-testid": testId, ...gridProps, children: children }));
export default PnCardHeaderItem;
