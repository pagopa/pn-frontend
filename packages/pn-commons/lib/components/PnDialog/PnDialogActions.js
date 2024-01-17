import { jsx as _jsx } from "react/jsx-runtime";
import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { Button, DialogActions } from '@mui/material';
import { useIsMobile } from '../../hooks';
const PnDialogActions = (props) => {
    const isMobile = useIsMobile();
    const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
    const buttons = Children.toArray(props.children).filter((child) => isValidElement(child) && child.type === Button);
    const enrichedButtons = buttons.map((button, index) => isValidElement(button)
        ? cloneElement(button, {
            ...button.props,
            fullWidth: isMobile,
            sx: { ...button.props.sx, marginBottom: isMobile && index > 0 ? 2 : 0 },
        })
        : button);
    return (_jsx(DialogActions, { "data-testid": "dialog-actions", ...props, disableSpacing: isMobile, sx: {
            textAlign: textPosition,
            flexDirection: isMobile ? 'column-reverse' : 'row',
            p: isMobile ? 3 : 4,
            pt: 2,
        }, children: enrichedButtons }));
};
export default PnDialogActions;
