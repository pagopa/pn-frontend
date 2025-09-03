import {
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

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
import { CodeInput, CopyToClipboardButton } from '@pagopa/mui-italia';

import { ErrorMessage } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PnDialog from '../PnDialog/PnDialog';
import PnDialogActions from '../PnDialog/PnDialogActions';
import PnDialogContent from '../PnDialog/PnDialogContent';

type Props = {
  title: ReactNode;
  subtitle: ReactNode;
  open: boolean;
  codeLength: number;
  initialValue?: string;
  codeSectionTitle: string;
  codeSectionAdditional?: ReactNode;
  confirmLabel?: string;
  cancelLabel: string;
  cancelCallback: () => void;
  confirmCallback?: (value: string) => void;
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
 * @param codeLength required code length
 * @param initialValue initial code
 * @param codeSectionTitle title of the section where is the code
 * @param codeSectionAdditional additional elments under the code
 * @param confirmLabel label of the confirm button
 * @param cancelLabel label of the cancel button
 * @param cancelCallback cancel callback
 * @param confirmCallback confirm callback (receives the code as string)
 * @param isReadOnly set if code is in readonly mode
 * @param error optional error state (title, message, hasError)
 */
const CodeModal = forwardRef<ModalHandle, Props>(
  (
    {
      title,
      subtitle,
      open,
      codeLength,
      initialValue = '',
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
    const [code, setCode] = useState<string>(initialValue.slice(0, codeLength));
    const [internalError, setInternalError] = useState({
      internalHasError: false,
      internalErrorTitle: '',
      internalErrorMessage: '',
    });

    const { internalHasError, internalErrorTitle, internalErrorMessage } = internalError;

    useEffect(() => {
      if (open && code !== initialValue) {
        setCode(initialValue);
      } else if (!open) {
        setCode('');
        setInternalError({
          internalHasError: false,
          internalErrorTitle: '',
          internalErrorMessage: '',
        });
      }
    }, [initialValue, open]);

    const changeHandler = useCallback(
      (val: string) => {
        setCode(val);

        if (val.length > 0 && !/^\d+$/.test(val)) {
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
      },
      [error?.hasError, error?.message, error?.title]
    );

    const confirmHandler = () => {
      if (!confirmCallback) {
        return;
      }

      const isComplete = code.length === codeLength;
      const isNumeric = /^\d+$/.test(code);

      if (!isComplete) {
        setInternalError({
          internalHasError: true,
          internalErrorTitle: getLocalizedOrDefaultLabel('common', `errors.empty_code.title`),
          internalErrorMessage: getLocalizedOrDefaultLabel('common', `errors.empty_code.message`),
        });
        return;
      }
      if (!isNumeric) {
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
              length={codeLength}
              value={code}
              error={internalHasError}
              onChange={changeHandler}
              inputMode="numeric"
              readOnly={isReadOnly}
            />
            {isReadOnly && (
              <CopyToClipboardButton
                id="copy-code-button"
                data-testid="copyCodeButton"
                sx={{ mt: 1.5 }}
                value={code}
                tooltipTitle={getLocalizedOrDefaultLabel('delegations', 'deleghe.code_copied')}
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
