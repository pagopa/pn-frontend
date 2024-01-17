import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material';
import { useIsMobile } from '../hooks';
/* eslint-disable functional/no-let */
let timeout;
/**
 * Session Modal to handle end of session or unauthenticated scenarios.
 * @param open boolean - if modal is open or no
 * @param title string - title of the modal
 * @param message string - message to show inside the modal
 * @param onConfirm action to perform when user click on "confirm" button
 * @param onConfirmLabel label to show on confirm button, default is "Riprova"
 * @param handleClose action to perform when closing modal when clicking outside of it
 * @param initTimeout init timeout after which modal close
 */
const SessionModal = ({ open, title, message, onConfirm, onConfirmLabel = 'Riprova', handleClose, initTimeout = false, }) => {
    const isMobile = useIsMobile();
    useEffect(() => {
        if (!initTimeout) {
            return;
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            if (handleClose) {
                handleClose();
            }
        }, 2000);
        // clean function
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, []);
    return (_jsxs(Dialog, { open: open, onClose: handleClose, "aria-labelledby": "session-dialog-title", "data-testid": "session-modal", children: [_jsx(DialogTitle, { sx: { textAlign: 'center', pt: 3 }, children: title }), _jsx(DialogContentText, { id: "session-dialog-description", sx: { textAlign: 'center', px: 3, pb: 1 }, children: message }), _jsx(DialogActions, { sx: { textAlign: 'center', flexDirection: isMobile ? 'column' : 'row', padding: 3 }, children: onConfirm && (_jsx(Button, { sx: { width: '100%' }, color: "primary", variant: "contained", onClick: onConfirm, children: onConfirmLabel })) })] }));
};
export default SessionModal;
