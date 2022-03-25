import { ReactNode, KeyboardEvent, useState, ChangeEvent } from 'react';
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
} from '@mui/material';

type Props = {
  title: ReactNode;
  subtitle: ReactNode;
  open: boolean;
  initialValues: Array<number | undefined>;
  handleClose: () => void;
  codeSectionTitle: string;
  codeSectionAdditional?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  cancelCallback?: () => void;
  confirmCallback?: (values: Array<number | undefined>) => void;
};

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
}: Props) => {
  const [inputsValues, setInputsValues] = useState(initialValues);
  const [inputsRef, setInputsRef] = useState(new Array(initialValues.length).fill(undefined));

  const keyDownHandler = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (!isNaN(Number(event.key)) || event.key === 'Enter' || event.key === 'Tab') {
      // focus next element
      if (index !== initialValues.length - 1) {
        setTimeout(() => inputsRef[index + 1].focus());
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
      previousValues[index] = Number((event.target as HTMLInputElement).value);
      return previousValues;
    });
  };

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
        <Typography fontSize={16} fontWeight={600}>{codeSectionTitle}</Typography>
        <Box sx={{ marginTop: '10px' }}>
          {initialValues.map((_value, index) => (
            <TextField
              key={index}
              id="outlined-basic"
              variant="outlined"
              placeholder="-"
              sx={{ width: '33px', height: '56px', marginRight: '10px' }}
              inputProps={{ maxLength: 1, sx: { padding: '16.5px 10px', textAlign: 'center' } }}
              onKeyDown={(event) => keyDownHandler(event, index)}
              onChange={(event) => changeHandler(event, index)}
              inputRef={(node) => {
                setInputsRef((prevRefs) => {
                  prevRefs[index] = node;
                  return prevRefs;
                });
              }}
            />
          ))}
        </Box>
        <Box sx={{ marginTop: '10px' }}>
          {codeSectionAdditional}
        </Box>
        <Divider sx={{ margin: '20px 0' }} />
      </DialogContent>
      <DialogActions>
        {(cancelLabel && cancelCallback) && (
          <Button variant="outlined" onClick={cancelCallback}>
            {cancelLabel}
          </Button>
        )}
        {(confirmLabel && confirmCallback) && <Button onClick={() => confirmCallback!(inputsValues)}>{confirmLabel}</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default CodeModal;
