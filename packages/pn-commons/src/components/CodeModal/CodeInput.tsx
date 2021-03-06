import {
  memo,
  useMemo,
  useRef,
  KeyboardEvent,
  useEffect,
  Fragment,
  forwardRef,
  useImperativeHandle,
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
const CodeInput = memo(
  forwardRef(({ initialValues, isReadOnly, hasError, onChange }: Props, ref) => {
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
      if (index > initialValues.length - 1 || index < 0) {
        return;
      }
      setTimeout(() => {
        // focus next input
        inputsRef.current[index].focus();
        // set cursor position
        if (inputsRef.current[index].setSelectionRange) {
          inputsRef.current[index].setSelectionRange(
            inputsRef.current[index].value,
            inputsRef.current[index].value
          );
        } else if (inputsRef.current[index].createTextRange) {
          const t = inputsRef.current[index].createTextRange();
          t.collapse(true);
          t.moveEnd('character', inputsRef.current[index].value);
          t.moveStart('character', inputsRef.current[index].value);
          t.select();
        }
      }, 25);
    };

    const keyDownHandler = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
      if (!isNaN(Number(event.key))) {
        /* eslint-disable-next-line functional/immutable-data */
        inputsRef.current[index].value = event.key;
        changeHandler();
      }
      if (
        !isNaN(Number(event.key)) ||
        event.key === 'Enter' ||
        (event.key === 'Tab' && !event.shiftKey)
      ) {
        // focus next element
        focusInput(index + 1);
        return;
      } else if (
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Delete'
      ) {
        return;
      } else if (event.key === 'Backspace' || (event.key === 'Tab' && event.shiftKey)) {
        focusInput(index - 1);
        return;
      }
      // prevent all values that aren't numbers
      event.preventDefault();
    };

    const changeHandler = () => {
      const inputsValues = inputsRef.current.map((inputElem) => inputElem.value);
      setCurrentValues(() => inputsValues);
      onChange(inputsValues);
    };

    const initInputsValues = () => {
      inputsRef.current.forEach((inputElem, index) => {
        inputElem.value = initialValues[index];
      });
    };

    useEffect(() => {
      // reset values
      if (inputsRef.current.every((v) => v && !v.value)) {
        initInputsValues();
      }
    }, [inputsRef.current.every((v) => v && !v.value)]);

    useImperativeHandle(ref, () => ({
      inputsValues: inputsRef.current.map((inputElem) => inputElem?.value),
    }));

    return (
      <Fragment>
        {initialValues.map((_value, index) => (
          <TextField
            autoComplete='off'
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
            onChange={changeHandler}
            value={currentValues[index]}
            inputRef={(node) => (inputsRef.current[index] = node)}
            color={hasError ? 'error' : 'primary'}
            error={hasError}
          />
        ))}
      </Fragment>
    );
  })
);

export default CodeInput;
