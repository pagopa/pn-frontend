import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, Grid, Slide, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCustomMobileDialogContext } from './CustomMobileDialog.context';
const MobileDialog = styled(Dialog)(() => ({
    '& .MuiDialog-container': {
        height: 'auto',
        bottom: 0,
        position: 'absolute',
        width: '100%',
    },
    '& .MuiPaper-root': {
        borderRadius: '24px 24px 0px 0px',
    },
    '& .MuiDialogContent-root': {
        paddingTop: '20px !important',
        maxHeight: 'calc(100vh - 250px)',
    },
    '& .MuiDialogActions-root': {
        display: 'block',
        textAlign: 'center',
        padding: '20px 24px',
        '.MuiButton-root': {
            width: '100%',
            margin: '10px 0',
        },
    },
}));
const Transition = forwardRef(function Transition(props, ref) {
    return _jsx(Slide, { direction: "up", ref: ref, ...props });
});
/**
 * The content of the dialog (header, body and actions)
 * @param children the react component for the body and the actions
 * @param title title to show in the dialog header
 */
const CustomMobileDialogContent = forwardRef(({ children, title }, ref) => {
    const { open, toggleOpen } = useCustomMobileDialogContext();
    const handleClose = () => {
        toggleOpen();
    };
    useImperativeHandle(ref, () => ({
        toggleOpen,
    }));
    return (_jsxs(MobileDialog, { scroll: "paper", open: open, onClose: handleClose, TransitionComponent: Transition, fullScreen: true, "aria-labelledby": title, "data-testid": "mobileDialog", children: [_jsx(DialogTitle, { children: _jsxs(Grid, { container: true, direction: "row", alignItems: "center", children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(Typography, { variant: "h4", sx: { fontSize: '24px', fontWeight: '700' }, children: title }) }), _jsx(Grid, { item: true, xs: 6, textAlign: "right", children: _jsx(CloseIcon, { onClick: handleClose, sx: {
                                    position: 'relative',
                                    right: 0,
                                    top: 4,
                                    color: 'action.active',
                                    width: '32px',
                                    height: '32px',
                                } }) })] }) }), children] }));
});
export default CustomMobileDialogContent;
