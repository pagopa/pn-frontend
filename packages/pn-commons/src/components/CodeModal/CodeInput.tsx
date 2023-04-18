import {
  memo,
  useMemo,
  useRef,
  KeyboardEvent,
  Fragment,
  useState,
  ChangeEvent,
  useEffect,
} from 'react';
import { TextField } from '@mui/material';

type Props = {
  initialValues: Array<string>;
  onChange: (values: Array<string>) => void;
  isReadOnly?: boolean;
  hasError?: boolean;
};

/**
 * Inputs for code modal component.
 * @param initialValues initial code
 * @param isReadOnly set if code is in readonly mode
 * @param hasError set if there is an error
 * @param onChange function to listen on inputs changes
 */
const CodeInput = ({ initialValues, isReadOnly, hasError, onChange }: Props) => {
  const [currentValues, setCurrentValues] = useState(initialValues);
  const inputsRef = useRef(new Array(initialValues.length).fill(undefined));

  const inputStyle = useMemo(() => {
    /* eslint-disable functional/no-let */
    let color = isReadOnly ? 'primary.main' : '';
    color = hasError ? 'error.main' : color;
    /* eslint-enalbe functional/no-let */
    return {
      width: '33px',
      height: '56px',
      marginRight: '10px',
      input: { color },
    };
  }, [hasError]);

  const focusInput = (index: number) => {
    if (index < 0) {
      return;
    }
    if (index > initialValues.length - 1) {
      setTimeout(() => {
        inputsRef.current[index - 1].blur();
      }, 25);
      return;
    }
    setTimeout(() => {
      // focus input
      inputsRef.current[index].focus();
      // set cursor position
      if (inputsRef.current[index].setSelectionRange) {
        inputsRef.current[index].setSelectionRange(1, 1);
      } else if (inputsRef.current[index].createTextRange) {
        const t = inputsRef.current[index].createTextRange();
        t.collapse(true);
        t.moveEnd('character', 1);
        t.moveStart('character', 1);
        t.select();
      }
    }, 25);
  };

  const keyDownHandler = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    const cursorPosition = (event.target as any).selectionStart;
    if (!isNaN(Number(event.key)) && currentValues[index]) {
      changeInputValue(event.key, index);
    }
    if (
      !isNaN(Number(event.key)) ||
      event.key === 'Enter' ||
      (event.key === 'Tab' && !event.shiftKey) ||
      (event.key === 'ArrowRight' && cursorPosition === 1)
    ) {
      // focus next element
      focusInput(index + 1);
      return;
    } else if (
      event.key === 'Backspace' ||
      (event.key === 'Tab' && event.shiftKey) ||
      (event.key === 'ArrowLeft' && cursorPosition === 0)
    ) {
      // focus previous element
      focusInput(index - 1);
      return;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Delete') {
      return;
    }
    // prevent all values that aren't numbers
    event.preventDefault();
  };

  const changeInputValue = (value: string, index: number) => {
    setCurrentValues((previousValues) => {
      const inputsValues = [...previousValues];
      // eslint-disable-next-line functional/immutable-data
      inputsValues[index] = value;
      return inputsValues;
    });
  };

  const changeHandler = (event: ChangeEvent, index: number) => {
    changeInputValue((event.target as any).value, index);
  };

  useEffect(() => {
    onChange(currentValues);
  }, [currentValues]);

  return (
    <Fragment>
      {initialValues.map((_value, index) => (
        <TextField
          data-testid={`codeInput(${index})`}
          autoComplete="off"
          key={index}
          id="outlined-basic"
          variant="outlined"
          placeholder="-"
          sx={inputStyle}
          inputProps={{
            maxLength: 1,
            sx: { padding: '16.5px 10px', textAlign: 'center' },
            readOnly: isReadOnly,
            onClick: (e) =>
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
              ),
          }}
          onKeyDown={(event) => keyDownHandler(event, index)}
          onChange={(event) => changeHandler(event, index)}
          value={currentValues[index]}
          // eslint-disable-next-line functional/immutable-data
          inputRef={(node) => (inputsRef.current[index] = node)}
          color={hasError ? 'error' : 'primary'}
          error={hasError}
        />
      ))}
    </Fragment>
  );
};

export default memo(CodeInput);
