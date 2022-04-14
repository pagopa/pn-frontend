import { ReactNode, KeyboardEvent, useState, ChangeEvent, useEffect, memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Divider,
  TextField,
  Typography,
  Box,
  Alert,
  AlertTitle,
} from '@mui/material';

import { useIsMobile } from '../hooks/IsMobile.hook';

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
const CodeModal = memo(({
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
  const [inputsValues, setInputsValues] = useState(initialValues);
  const [inputsRef, setInputsRef] = useState(new Array(initialValues.length).fill(undefined));
  const isMobile = useIsMobile();

  const focusInput = (index: number) => {
    setTimeout(() => {
      // focus next input
      inputsRef[index].focus();
      // set cursor position
      if (inputsRef[index].setSelectionRange) {
        inputsRef[index].setSelectionRange(inputsRef[index].value, inputsRef[index].value);
      } else if (inputsRef[index].createTextRange) {
        const t = inputsRef[index].createTextRange();
        t.collapse(true);
        t.moveEnd('character', inputsRef[index].value);
        t.moveStart('character', inputsRef[index].value);
        t.select();
      }
    });
  }

  const keyDownHandler = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (!isNaN(Number(event.key)) || event.key === 'Enter' || event.key === 'Tab') {
      // focus next element
      if (index !== initialValues.length - 1) {
        focusInput(index + 1);
      }
      return;
    } else if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Delete'
    ) {
      return;
    } else if (event.key === 'Backspace') {
      if (inputsRef[index].value === '' && index > 0) {
        // focus prev element
        focusInput(index - 1);
      }
      return;
    }
    // prevent all values that aren't numbers
    event.preventDefault();
  };

  const changeHandler = (event: ChangeEvent, index: number) => {
    setInputsValues((previousValues) => {
      const prevValues = [...previousValues];
      prevValues[index] = (event.target as HTMLInputElement).value;
      return prevValues;
    });
  };

  useEffect(() => {
    // reset values
    setInputsValues(initialValues);
  }, [open]);

  const codeIsValid = inputsValues.every((v) => v);
  /* eslint-disable functional/no-let */
  let inputColor = isReadOnly ? 'primary.main' : '';
  inputColor = hasError ? 'error.main' : inputColor;
  /* eslint-enalbe functional/no-let */

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      data-testid="codeDialog"
    >
      <DialogTitle id="dialog-title" sx={{textAlign: isMobile ? 'center' : 'left'}}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description" sx={{textAlign: isMobile ? 'center' : 'left'}}>{subtitle}</DialogContentText>
        <Divider sx={{ margin: '20px 0' }} />
        <Typography fontSize={16} fontWeight={600} sx={{textAlign: isMobile ? 'center' : 'left'}}>
          {codeSectionTitle}
        </Typography>
        <Box sx={{ marginTop: '10px', textAlign: isMobile ? 'center' : 'left' }}>
          {initialValues.map((_value, index) => (
            <TextField
              key={index}
              id="outlined-basic"
              variant="outlined"
              placeholder="-"
              sx={{
                width: '33px',
                height: '56px',
                marginRight: '10px',
                input: { color: inputColor },
              }}
              inputProps={{
                maxLength: 1,
                sx: { padding: '16.5px 10px', textAlign: 'center' },
                readOnly: isReadOnly,
              }}
              onKeyDown={(event) => keyDownHandler(event, index)}
              onChange={(event) => changeHandler(event, index)}
              inputRef={(node) => {
                setInputsRef((prevRefs) => {
                  prevRefs[index] = node;
                  return prevRefs;
                });
              }}
              value={inputsValues[index]}
              color={hasError ? 'error' : 'primary'}
              error={hasError}
            />
          ))}
        </Box>
        <Box sx={{ marginTop: '10px', textAlign: isMobile ? 'center' : 'left' }}>{codeSectionAdditional}</Box>
        <Divider sx={{ margin: '20px 0' }} />
        {hasError && errorMessage && (
          <Alert data-testid="errorAlert" severity="error" sx={{textAlign: isMobile ? 'center' : 'left'}}>
            <AlertTitle>{errorTitle}</AlertTitle>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{textAlign: isMobile ? 'center' : 'left', flexDirection: isMobile ? 'column' : 'row'}}>
        {cancelLabel && cancelCallback && (
          <Button variant="outlined" onClick={cancelCallback} fullWidth={isMobile}>
            {cancelLabel}
          </Button>
        )}
        {confirmLabel && confirmCallback && (
          <Button variant="contained" onClick={() => confirmCallback(inputsValues)} disabled={!codeIsValid} fullWidth={isMobile} sx={{marginTop: isMobile ? '10px' : 0, marginLeft: isMobile ? 0 : 'auto'}}>
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});

export default CodeModal;
