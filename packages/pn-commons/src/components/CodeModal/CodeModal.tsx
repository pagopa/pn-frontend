import { ReactNode, useState, memo, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Divider,
  Typography,
  Box,
  Alert,
  AlertTitle,
} from '@mui/material';

import { useIsMobile } from '../../hooks';
import CodeInput from './CodeInput';

type Props = {
  title: ReactNode;
  subtitle: ReactNode;
  open: boolean;
  initialValues: Array<string>;
  handleClose: () => void;
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
 * @param handleClose function that is called when modal is closed
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
    handleClose,
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        data-testid="codeDialog"
      >
        <DialogTitle id="dialog-title" sx={{ textAlign: textPosition }}>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description" sx={{ textAlign: textPosition }}>
            {subtitle}
          </DialogContentText>
          <Divider sx={{ margin: '20px 0' }} />
          <Typography fontSize={16} fontWeight={600} sx={{ textAlign: textPosition }}>
            {codeSectionTitle}
          </Typography>
          <Box sx={{ marginTop: '10px', textAlign: textPosition }}>
            <CodeInput
              initialValues={initialValues}
              isReadOnly={isReadOnly}
              hasError={hasError}
              onChange={changeHandler}
            />
          </Box>
          <Box sx={{ marginTop: '10px', textAlign: textPosition }}>{codeSectionAdditional}</Box>
          <Divider sx={{ margin: '20px 0' }} />
          {hasError && (
            <Alert data-testid="errorAlert" severity="error" sx={{ textAlign: textPosition }}>
              <AlertTitle data-testid="CodeModal error title">{errorTitle}</AlertTitle>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions
          disableSpacing={isMobile}
          sx={{
            textAlign: textPosition,
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          {cancelLabel && cancelCallback && (
            <Button
              variant="outlined"
              onClick={cancelCallback}
              fullWidth={isMobile}
              data-testid="codeCancelButton"
            >
              {cancelLabel}
            </Button>
          )}
          {confirmLabel && confirmCallback && (
            <Button
              variant="contained"
              data-testid="codeConfirmButton"
              onClick={confirmHandler}
              disabled={!codeIsValid}
              fullWidth={isMobile}
              sx={{ marginTop: isMobile ? '10px' : 0 }}
            >
              {confirmLabel}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
);

export default CodeModal;
