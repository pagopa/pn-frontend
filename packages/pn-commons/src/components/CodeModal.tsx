import { ReactNode, KeyboardEvent, useState, ChangeEvent, useEffect } from 'react';
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
} from '@mui/material';

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
 * @param errorMessage message to show when there is an error
 */
const CodeModal = ({
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
  errorMessage,
}: Props) => {
  const [inputsValues, setInputsValues] = useState(initialValues);
  const [inputsRef, setInputsRef] = useState(new Array(initialValues.length).fill(undefined));

  const keyDownHandler = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (!isNaN(Number(event.key)) || event.key === 'Enter' || event.key === 'Tab') {
      // focus next element
      if (index !== initialValues.length - 1) {
        setTimeout(() => {
          // focus next input
          inputsRef[index + 1].focus();
          // set cursor position
          if (inputsRef[index + 1].setSelectionRange) {
            inputsRef[index + 1].setSelectionRange(0, 0);
          } else if (inputsRef[index + 1].createTextRange) {
            const t = inputsRef[index + 1].createTextRange();
            t.collapse(true);
            t.moveEnd('character', 0);
            t.moveStart('character', 0);
            t.select();
          }
        });
      }
      return;
    } else if (
      event.key === 'Backspace' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Delete'
    ) {
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
  const inputColor = hasError ? 'error.main' : 'primary.main';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      data-testid="codeDialog"
    >
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">{subtitle}</DialogContentText>
        <Divider sx={{ margin: '20px 0' }} />
        <Typography fontSize={16} fontWeight={600}>
          {codeSectionTitle}
        </Typography>
        <Box sx={{ marginTop: '10px' }}>
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
        <Box sx={{ marginTop: '10px' }}>{codeSectionAdditional}</Box>
        <Divider sx={{ margin: '20px 0' }} />
        {hasError && errorMessage && (
          <Alert data-testid="errorAlert" severity="error">
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        {cancelLabel && cancelCallback && (
          <Button variant="outlined" onClick={cancelCallback}>
            {cancelLabel}
          </Button>
        )}
        {confirmLabel && confirmCallback && (
          <Button onClick={() => confirmCallback(inputsValues)} disabled={!codeIsValid}>
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CodeModal;
