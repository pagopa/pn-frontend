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
      for (const input of inputsRef.current) {
        if (input === document.activeElement) {
          setTimeout(() => {
            input.blur();
          }, 25);
          break;
        }
      }
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
    if ((event.key === 'Tab' && !event.shiftKey) || event.key === 'ArrowRight') {
      // focus next element
      focusInput(index + 1);
    } else if ((event.key === 'Tab' && event.shiftKey) || event.key === 'ArrowLeft') {
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
    // remove from value those characters that aren't letters neither numbers
    value = value.replace(/[^a-z\d]/gi, '');
    if (value !== '') {
      // case maxLength 2
      if (value.length > 1) {
        const cursorPosition = (event.target as HTMLInputElement).selectionStart;
        value = value.charAt(cursorPosition === 1 ? 0 : 1);
      }
      changeInputValue(value, index);
    }
  };

  const pasteHandler = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    // eslint-disable-next-line functional/no-let
    let pastedCode = event.clipboardData.getData('text');
    pastedCode = pastedCode.replace(/[^a-z\d]/gi, '');
    const maxLengthRequiredCode = pastedCode.slice(0, initialValues.length);
    const values = maxLengthRequiredCode.split('');
    // we create an array with empty values for those cases in which the copied values are less than required ones
    // initialValues.length - values.length can be only >= 0 because of the slice of pastedCode
    const emptyValues = new Array(initialValues.length - values.length).fill('');
    setCurrentValues(values.concat(emptyValues));
    focusInput(values.length);
  };

  useEffect(() => {
    onChange(currentValues);
  }, [currentValues]);

  const cifre = ['primo', 'secondo', 'terzo', 'quarto', 'ultimo'];

  return (
    <Fragment>
      {initialValues.map((_value, index) => (
        <TextField
          aria-label={`input numero ${cifre[index]}`}
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
            pattern: '^[0-9a-zA-Z]{1}$',
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
