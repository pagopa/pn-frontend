import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useMemo, useState } from 'react';
import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Typography, } from '@mui/material';
import { CopyToClipboardButton } from '@pagopa/mui-italia';
import { useIsMobile } from '../../hooks';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import CodeInput from './CodeInput';
/**
 * This modal allows the user to input a verification code.
 * @param title title to show
 * @param subtitle subtitle to show
 * @param open flag to hide/show modal
 * @param initialValues initial code
 * @param codeSectionTitle title of the section where is the code
 * @param codeSectionAdditional additional elments under the code
 * @param confirmLabel label of the confirm button
 * @param cancelLabel label of the cancel button
 * @param isReadOnly set if code is in readonly mode
 * @param hasError set if there is an error
 * @param errorTitle title to show when there is an error
 * @param errorMessage message to show when there is an error
 */
const CodeModal = memo(({ title, subtitle, open, initialValues, codeSectionTitle, codeSectionAdditional, confirmLabel, cancelLabel, cancelCallback, confirmCallback, isReadOnly = false, hasError = false, errorTitle, errorMessage, }) => {
    const [code, setCode] = useState(initialValues);
    const isMobile = useIsMobile();
    const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
    const codeIsValid = code.every((v) => v);
    const changeHandler = useCallback((inputsValues) => {
        setCode(inputsValues);
    }, []);
    const confirmHandler = () => {
        if (!confirmCallback) {
            return;
        }
        confirmCallback(code);
    };
    return (_jsxs(Dialog, { open: open, "aria-labelledby": "dialog-title", "aria-describedby": "dialog-description", "data-testid": "codeDialog", disableEscapeKeyDown: true, children: [_jsx(DialogTitle, { id: "dialog-title", sx: { textAlign: textPosition, pt: 4, px: 4 }, children: title }), _jsxs(DialogContent, { sx: { px: 4 }, children: [_jsx(DialogContentText, { id: "dialog-description", sx: { textAlign: textPosition }, children: subtitle }), _jsx(Divider, { sx: { margin: '20px 0' } }), _jsx(Typography, { fontSize: 16, fontWeight: 600, sx: { textAlign: textPosition }, children: codeSectionTitle }), _jsxs(Box, { sx: { mt: 2, textAlign: textPosition }, children: [_jsx(CodeInput, { initialValues: initialValues, isReadOnly: isReadOnly, hasError: hasError, onChange: changeHandler }), isReadOnly && (_jsx(CopyToClipboardButton, { id: "copy-code-button", "data-testid": "copyCodeButton", sx: { mt: 1.5 }, value: initialValues.join(''), tooltipTitle: getLocalizedOrDefaultLabel('delegations', 'deleghe.code_copied', 'Codice copiato') }))] }), _jsx(Box, { sx: { marginTop: '10px', textAlign: textPosition }, children: codeSectionAdditional }), _jsx(Divider, { sx: { margin: '20px 0' } }), hasError && (_jsxs(Alert, { id: "error-alert", "data-testid": "errorAlert", severity: "error", sx: { textAlign: textPosition }, children: [_jsx(AlertTitle, { "data-testid": "CodeModal error title", id: "codeModalErrorTitle", children: errorTitle }), errorMessage] }))] }), _jsxs(DialogActions, { disableSpacing: isMobile, sx: {
                    textAlign: textPosition,
                    flexDirection: isMobile ? 'column-reverse' : 'row',
                    px: 4,
                    pb: 4,
                }, children: [cancelLabel && cancelCallback && (_jsx(Button, { id: "code-cancel-button", variant: "outlined", onClick: cancelCallback, fullWidth: isMobile, "data-testid": "codeCancelButton", sx: { mt: isMobile ? 2 : 0 }, children: cancelLabel })), confirmLabel && confirmCallback && (_jsx(Button, { id: "code-confirm-button", variant: "contained", "data-testid": "codeConfirmButton", onClick: confirmHandler, disabled: !codeIsValid, fullWidth: isMobile, children: confirmLabel }))] })] }));
});
export default CodeModal;
