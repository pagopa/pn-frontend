import { ReactNode, memo, useCallback, useMemo, useState } from 'react';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PnDialog from '../PnDialog/PnDialog';
import PnDialogActions from '../PnDialog/PnDialogActions';
import PnDialogContent from '../PnDialog/PnDialogContent';
import CodeInput from './CodeInput';

type Props = {
  title: ReactNode;
  subtitle: ReactNode;
  open: boolean;
  initialValues: Array<string>;
  codeSectionTitle: string;
  codeSectionAdditional?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  cancelCallback?: () => void;
  confirmCallback?: (values: Array<string>) => void;
  isReadOnly?: boolean;
  hasError?: boolean;
  errorTitle?: string;
  errorMessage?: string;
};

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
const CodeModal = memo(
  ({
    title,
    subtitle,
    open,
    initialValues,
    codeSectionTitle,
    codeSectionAdditional,
    confirmLabel,
    cancelLabel,
    cancelCallback,
    confirmCallback,
    isReadOnly = false,
    hasError = false,
    errorTitle,
    errorMessage,
  }: Props) => {
    const [code, setCode] = useState(initialValues);
    const isMobile = useIsMobile();
    const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
    const codeIsValid = code.every((v) => v);

    const changeHandler = useCallback((inputsValues: Array<string>) => {
      setCode(inputsValues);
    }, []);

    const confirmHandler = () => {
      if (!confirmCallback) {
        return;
      }
      confirmCallback(code);
    };

    return (
      <PnDialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        data-testid="codeDialog"
        disableEscapeKeyDown
      >
        <DialogTitle id="dialog-title">{title}</DialogTitle>
        <PnDialogContent>
          <DialogContentText id="dialog-description">{subtitle}</DialogContentText>
          <Divider sx={{ my: 2 }} />
          <Typography fontSize={16} fontWeight={600} sx={{ textAlign: 'left' }}>
            {codeSectionTitle}
          </Typography>
          <Box sx={{ mt: 2, textAlign: 'left' }}>
            <CodeInput
              initialValues={initialValues}
              isReadOnly={isReadOnly}
              hasError={hasError}
              onChange={changeHandler}
            />
            {isReadOnly && (
              <CopyToClipboardButton
                id="copy-code-button"
                data-testid="copyCodeButton"
                sx={{ mt: 1.5 }}
                value={initialValues.join('')}
                tooltipTitle={getLocalizedOrDefaultLabel(
                  'delegations',
                  'deleghe.code_copied',
                  'Codice copiato'
                )}
              />
            )}
          </Box>
          <Box sx={{ mt: 2, textAlign: isMobile ? 'left' : 'center' }}>{codeSectionAdditional}</Box>
          {hasError && (
            <Alert
              id="error-alert"
              data-testid="errorAlert"
              severity="error"
              sx={{ textAlign: textPosition, mt: 2 }}
            >
              <AlertTitle data-testid="CodeModal error title">{errorTitle}</AlertTitle>
              {errorMessage}
            </Alert>
          )}
        </PnDialogContent>
        <PnDialogActions>
          {cancelLabel && cancelCallback && (
            <Button
              id="code-cancel-button"
              variant="outlined"
              onClick={cancelCallback}
              data-testid="codeCancelButton"
            >
              {cancelLabel}
            </Button>
          )}
          {confirmLabel && confirmCallback && (
            <Button
              id="code-confirm-button"
              variant="contained"
              data-testid="codeConfirmButton"
              onClick={confirmHandler}
              disabled={!codeIsValid}
            >
              {confirmLabel}
            </Button>
          )}
        </PnDialogActions>
      </PnDialog>
    );
  }
);

export default CodeModal;
