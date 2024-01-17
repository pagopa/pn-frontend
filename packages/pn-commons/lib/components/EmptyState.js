import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography } from '@mui/material';
import { KnownSentiment, iconForKnownSentiment } from '../models/EmptyState';
const EmptyState = ({ sentimentIcon = KnownSentiment.DISSATISFIED, children }) => {
    const FinalIcon = typeof sentimentIcon === 'string' ? iconForKnownSentiment(sentimentIcon) : sentimentIcon;
    const linksSxProps = {
        cursor: 'pointer',
        display: 'inline',
        verticalAlign: 'unset',
        fontWeight: 'bold',
        fontSize: 'inherit',
    };
    return (_jsxs(Box, { component: "div", "data-testid": "emptyState", display: "block", sx: {
            textAlign: 'center',
            margin: '16px 0',
            padding: '16px',
            backgroundColor: 'background.paper',
            borderRadius: '4px',
        }, children: [FinalIcon && (_jsx(FinalIcon, { sx: {
                    verticalAlign: 'middle',
                    display: 'inline',
                    mr: '20px',
                    mb: '2px',
                    fontSize: '1.25rem',
                    color: 'action.active',
                } })), _jsx(Typography, { variant: "body2", sx: { display: 'inline', '& button': linksSxProps }, children: children })] }));
};
export default EmptyState;
