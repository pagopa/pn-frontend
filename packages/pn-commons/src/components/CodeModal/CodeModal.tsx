import { ReactNode, forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react';

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

import { ErrorMessage } from '../../models';
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
  cancelLabel: string;
  cancelCallback: () => void;
  confirmCallback?: (values: Array<string>) => void;
  isReadOnly?: boolean;
  error?: { title: string; message: string; hasError: boolean };
};

type ModalHandle = {
  updateError: (error: ErrorMessage, codeNotValid: boolean) => void;
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
 */
const CodeModal = forwardRef<ModalHandle, Props>(
  (
    {
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
      error,
    }: Props,
    ref
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const [code, setCode] = useState(initialValues);
    const [internalError, setInternalError] = useState({
      internalHasError: false,
      internalErrorTitle: '',
      internalErrorMessage: '',
    });

    const { internalHasError, internalErrorTitle, internalErrorMessage } = internalError;

    const codeIsValid = code.every((v) => (!isNaN(Number(v)) ? v : false));
    const codeIsEmpty = code.some((v) => !v);

    const changeHandler = useCallback((inputsValues: Array<string>) => {
      setCode(inputsValues);
      if (isNaN(Number(inputsValues.join('')))) {
        setInternalError({
          internalHasError: true,
          internalErrorTitle: getLocalizedOrDefaultLabel(
            'common',
            `errors.invalid_type_code.title`
          ),
          internalErrorMessage: getLocalizedOrDefaultLabel(
            'common',
            `errors.invalid_type_code.message`
          ),
        });
      } else {
        setInternalError({
          internalHasError: error?.hasError ?? false,
          internalErrorTitle: error?.title ?? '',
          internalErrorMessage: error?.message ?? '',
        });
      }
    }, []);

    const confirmHandler = () => {
      if (!confirmCallback) {
        return;
      }
      if (codeIsEmpty) {
        setInternalError({
          internalHasError: true,
          internalErrorTitle: getLocalizedOrDefaultLabel('common', `errors.empty_code.title`),
          internalErrorMessage: getLocalizedOrDefaultLabel('common', `errors.empty_code.message`),
        });
        return;
      }
      if (!codeIsValid) {
        setInternalError({
          internalHasError: true,
          internalErrorTitle: getLocalizedOrDefaultLabel(
            'common',
            `errors.invalid_type_code.title`
          ),
          internalErrorMessage: getLocalizedOrDefaultLabel(
            'common',
            `errors.invalid_type_code.message`
          ),
        });
        return;
      }
      confirmCallback(code);
    };

    const updateError = useCallback((error: ErrorMessage, codeNotValid: boolean) => {
      setInternalError({
        internalHasError: codeNotValid,
        internalErrorTitle: error.title,
        internalErrorMessage: error.content,
      });
    }, []);

    useImperativeHandle(ref, () => ({ updateError }));

    return (
      <PnDialog
        open={open}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        data-testid="codeDialog"
        disableEscapeKeyDown
      >
        <DialogTitle id="dialog-title" sx={{ overflowWrap: 'anywhere' }}>
          {title}
        </DialogTitle>
        <PnDialogContent>
          <DialogContentText id="dialog-description">{subtitle}</DialogContentText>
          <Divider sx={{ my: 2 }} />
          <Typography fontSize={16} fontWeight={600}>
            {codeSectionTitle}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <CodeInput
              initialValues={initialValues}
              isReadOnly={isReadOnly}
              hasError={internalHasError}
              onChange={changeHandler}
            />
            {isReadOnly && (
              <CopyToClipboardButton
                id="copy-code-button"
                data-testid="copyCodeButton"
                sx={{ mt: 1.5 }}
                value={initialValues.join('')}
                tooltipTitle={getLocalizedOrDefaultLabel('delegations', 'deleghe.code_copied')}
                autoFocus
              />
            )}
          </Box>
          {codeSectionAdditional && <Box sx={{ mt: 2 }}>{codeSectionAdditional}</Box>}
          {internalHasError && (
            <Alert id="error-alert" data-testid="errorAlert" severity="error" sx={{ mt: 2 }}>
              <AlertTitle id="codeModalErrorTitle" data-testid="CodeModal error title">
                {internalErrorTitle}
              </AlertTitle>
              {internalErrorMessage}
            </Alert>
          )}
        </PnDialogContent>
        <PnDialogActions>
          <Button
            id="code-cancel-button"
            variant="outlined"
            onClick={cancelCallback}
            data-testid="codeCancelButton"
          >
            {cancelLabel}
          </Button>
          {confirmLabel && confirmCallback && (
            <Button
              id="code-confirm-button"
              variant={internalHasError ? 'outlined' : 'contained'}
              color={internalHasError ? 'error' : 'primary'}
              data-testid="codeConfirmButton"
              onClick={confirmHandler}
              autoFocus={!isReadOnly}
            >
              {confirmLabel}
            </Button>
          )}
        </PnDialogActions>
      </PnDialog>
    );
  }
);

export default memo(CodeModal);
