import {
  ChangeEvent,
  ClipboardEvent,
  Fragment,
  KeyboardEvent,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { TextField } from '@mui/material';

type Props = {
  initialValues: Array<string>;
  onChange: (values: Array<string>) => void;
  onInputError: () => void;
  isReadOnly?: boolean;
  hasError?: boolean;
};

/**
 * Inputs for code modal component.
 * @param initialValues initial code
 * @param isReadOnly set if code is in readonly mode
 * @param hasError set if there is an error
 * @param onChange function to listen on inputs changes
 * @param onInputError function to listen on inputs type errors
 */
const CodeInput = ({ initialValues, isReadOnly, hasError, onChange, onInputError }: Props) => {
  const [currentValues, setCurrentValues] = useState(initialValues);
  const inputsRef = useRef(new Array(initialValues.length).fill(undefined));

  const inputStyle = useMemo(() => {
    // eslint-disable-next-line functional/no-let
    let color = isReadOnly ? 'primary.main' : '';
    color = hasError ? 'error.main' : color;
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
      // the variable is to prevent test fail
      const input = inputsRef.current[index - 1];
      setTimeout(() => {
        input.blur();
      }, 25);
      return;
    }
    // the variable is to prevent test fail
    const input = inputsRef.current[index];
    setTimeout(() => {
      // focus input
      input.focus();
      // select input
      input.select();
    }, 25);
  };

  const keyDownHandler = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (
      event.key === 'Enter' ||
      (event.key === 'Tab' && !event.shiftKey) ||
      event.key === 'ArrowRight' ||
      event.key === 'Delete' ||
      event.key === currentValues[index]
    ) {
      // focus next element
      focusInput(index + 1);
    } else if (
      event.key === 'Backspace' ||
      (event.key === 'Tab' && event.shiftKey) ||
      event.key === 'ArrowLeft'
    ) {
      // focus previous element
      focusInput(index - 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
  };

  const changeInputValue = (value: string, index: number) => {
    setCurrentValues((previousValues) => {
      const inputsValues = [...previousValues];
      // eslint-disable-next-line functional/immutable-data
      inputsValues[index] = value;
      if (!Number(inputsValues[index])) {
        onInputError();
      }
      return inputsValues;
    });
  };

  const changeHandler = (event: ChangeEvent, index: number) => {
    // eslint-disable-next-line functional/no-let
    let value = String((event.target as HTMLInputElement).value);
    // removed value - i.e. backspace or canc clicked
    if (value === '' && currentValues[index] !== '') {
      changeInputValue(value, index);
      return;
    }
    if (value !== '') {
      // case maxLength 2
      if (value.length > 1) {
        const cursorPosition = (event.target as HTMLInputElement).selectionStart;
        value = value.charAt(cursorPosition === 1 ? 0 : 1);
      }
      changeInputValue(value, index);
      // focus next element
      focusInput(index + 1);
    }
  };

  const pasteHandler = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pastedCode = event.clipboardData.getData('text');
    // Ensure the copied code matches the required length
    const maxLengthRequiredCode = pastedCode.slice(0, initialValues.length);
    const values = maxLengthRequiredCode.split('');

    if (values.length !== initialValues.length) {
      const fillEmptyInputs = () => {
        if (initialValues.length - values.length !== 0) {
          // eslint-disable-next-line functional/immutable-data
          values.push('');
          fillEmptyInputs();
        }
      };
      fillEmptyInputs();
    }
    setCurrentValues(values);
    // Focus the last input and set cursor at the end, then remove focus.
    // it's needed to focus on lastInput before to step on to lastInput + 1
    const lastInput = values.length - 1;
    focusInput(lastInput);
    focusInput(lastInput + 1);
    if (!Number(maxLengthRequiredCode)) {
      onInputError();
    }
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
          id={`code-input-${index}`}
          variant="outlined"
          placeholder="-"
          sx={inputStyle}
          inputProps={{
            // the value 2 is when we focus on one input and the value is not selected, but the cursor is shown
            maxLength: 2,
            sx: { padding: '16.5px 10px', textAlign: 'center' },
            readOnly: isReadOnly,
            'data-testid': `code-input-${index}`,
          }}
          onKeyDown={(event) => keyDownHandler(event, index)}
          onChange={(event) => changeHandler(event, index)}
          onFocus={(event) => event.target.select()}
          onPaste={(event) => pasteHandler(event)}
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
