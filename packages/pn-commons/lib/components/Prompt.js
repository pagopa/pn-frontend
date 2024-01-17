import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from '@mui/material';
import { useIsMobile } from '../hooks';
import { usePrompt } from '../hooks/usePrompt';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
const Prompt = ({ title, message, children, eventTrackingCallbackPromptOpened, eventTrackingCallbackCancel, eventTrackingCallbackConfirm, }) => {
    const [showPrompt, confirmNavigation, cancelNavigation] = usePrompt(true, eventTrackingCallbackCancel, eventTrackingCallbackConfirm);
    const isMobile = useIsMobile();
    const textPosition = isMobile ? 'center' : 'left';
    useEffect(() => {
        if (showPrompt) {
            eventTrackingCallbackPromptOpened();
        }
    });
    return (_jsxs(_Fragment, { children: [_jsxs(Dialog, { onClose: cancelNavigation, open: showPrompt, maxWidth: 'xs', fullWidth: true, "data-testid": "promptDialog", children: [_jsx(DialogTitle, { sx: { p: isMobile ? 3 : 4, pb: 2, textAlign: textPosition }, children: title }), _jsx(DialogContent, { sx: { p: isMobile ? 3 : 4, textAlign: textPosition }, children: _jsx(DialogContentText, { children: message }) }), _jsxs(DialogActions, { disableSpacing: isMobile, sx: {
                            textAlign: textPosition,
                            flexDirection: isMobile ? 'column-reverse' : 'row',
                            p: isMobile ? 3 : 4,
                            pt: 0,
                        }, children: [_jsx(Button, { variant: "outlined", onClick: cancelNavigation, fullWidth: isMobile, children: getLocalizedOrDefaultLabel('common', 'button.annulla', 'Annulla') }), _jsx(Button, { id: "button-exit", variant: "contained", onClick: confirmNavigation, autoFocus: true, sx: { mb: isMobile ? 2 : 0 }, fullWidth: isMobile, "data-testid": "confirmExitBtn", children: getLocalizedOrDefaultLabel('common', 'button.exit', 'Esci') })] })] }), children] }));
};
export default Prompt;
