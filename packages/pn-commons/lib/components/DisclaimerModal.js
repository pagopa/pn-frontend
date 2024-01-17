import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, } from '@mui/material';
import { useIsMobile } from '../hooks';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
const DisclaimerModal = ({ onConfirm, onCancel, confirmLabel, title, content, checkboxLabel, }) => {
    const isMobile = useIsMobile();
    const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
    const [checked, setChecked] = useState(false);
    const disabledConfirm = !checked && !!checkboxLabel;
    const handleChange = () => {
        setChecked(!checked);
    };
    return (_jsxs(Dialog, { open: true, "data-testid": "disclaimerDialog", children: [title && _jsx(DialogTitle, { sx: { p: 4, pb: 2 }, children: title }), _jsxs(DialogContent, { sx: { p: 4 }, children: [content && _jsx(Box, { children: content }), checkboxLabel && (_jsx(Box, { sx: { mt: 2, ml: 0.5 }, children: _jsx(FormControlLabel, { control: _jsx(Checkbox, { id: "checkbox-agree", checked: checked, onChange: handleChange, "data-testid": "disclaimer-checkbox" }), label: checkboxLabel }) }))] }), _jsxs(DialogActions, { disableSpacing: isMobile, sx: {
                    textAlign: textPosition,
                    flexDirection: isMobile ? 'column-reverse' : 'row',
                    p: 4,
                    pt: 0,
                }, children: [_jsx(Button, { id: "cancelButton", variant: "outlined", onClick: onCancel, fullWidth: isMobile, "data-testid": "disclaimer-cancel-button", children: getLocalizedOrDefaultLabel('common', 'button.annulla', 'Annulla') }), _jsx(Button, { id: "confirmButton", variant: "contained", onClick: onConfirm, disabled: disabledConfirm, fullWidth: isMobile, "data-testid": "disclaimer-confirm-button", sx: { mb: isMobile ? 2 : 0 }, children: confirmLabel })] })] }));
};
export default DisclaimerModal;
