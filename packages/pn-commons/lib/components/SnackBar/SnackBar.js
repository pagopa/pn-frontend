import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertTitle, IconButton, Snackbar } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';
import { MessageType } from '../../models/MessageType';
const SnackBar = ({ title, message, open, type, closingDelay, onClose, variant = 'outlined', }) => {
    const [openStatus, setOpenStatus] = useState(open);
    const isMobile = useIsMobile();
    const closeSnackBar = () => {
        setOpenStatus(false);
        if (onClose) {
            onClose();
        }
    };
    // create timer for closing snackbar after *closingDelay* milliseconds
    useEffect(() => {
        if (closingDelay && openStatus) {
            const timer = setTimeout(() => {
                closeSnackBar();
            }, closingDelay);
            return () => clearTimeout(timer);
        }
        // since it returns in a conditional branch, it must return in all cases
        // eslint-disable-next-line sonarjs/no-redundant-jump
        return;
    }, []);
    const getColor = new Map([
        [MessageType.ERROR, 'error'],
        [MessageType.WARNING, 'warning'],
        [MessageType.SUCCESS, 'success'],
        [MessageType.INFO, 'info'],
    ]);
    const action = (_jsx(_Fragment, { children: _jsx(IconButton, { size: "small", "aria-label": "close", color: "inherit", onClick: closeSnackBar, children: _jsx(CloseIcon, { fontSize: "small" }) }) }));
    return (_jsx(_Fragment, { children: openStatus && (_jsx("div", { "data-testid": "snackBarContainer", children: _jsx(Snackbar, { open: open, action: action, children: _jsxs(Alert, { onClose: closeSnackBar, severity: getColor.get(type), sx: {
                        position: 'fixed',
                        bottom: '64px',
                        right: isMobile ? '5%' : '64px',
                        zIndex: 100,
                        width: isMobile ? 'calc(100vw - 10%)' : '376px',
                        '& .MuiAlert-message': {
                            width: '100%',
                        },
                    }, variant: variant, children: [title && _jsx(AlertTitle, { id: `alert-api-status}`, children: title }), message] }) }) })) }));
};
export default SnackBar;
