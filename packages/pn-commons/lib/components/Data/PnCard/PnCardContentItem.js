import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography } from '@mui/material';
const PnCardContentItem = ({ children, label, wrapValueInTypography = true, testId, }) => (_jsxs(_Fragment, { children: [_jsx(Typography, { sx: { fontWeight: 'bold' }, variant: "caption", "data-testid": testId ? `${testId}Label` : null, children: label }), wrapValueInTypography && (_jsx(Typography, { variant: "body2", "data-testid": testId ? `${testId}Value` : null, children: children })), !wrapValueInTypography && _jsx(Box, { "data-testid": testId ? `${testId}Value` : null, children: children })] }));
export default PnCardContentItem;
