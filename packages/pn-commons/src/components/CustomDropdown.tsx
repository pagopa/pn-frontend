import { ChangeEvent, useEffect, useState } from 'react';

import { MenuItem, TextField, TextFieldProps } from '@mui/material';

type Props = {
  /** empty message when no items are available */
  emptyStateMessage?: string;
  /** map value string for empty item (default: empty string) */
  emptyItemValue?: string;
  /** map key string for empty item (default: empty string) */
  emptyItemKey?: string;
  /** map label string for empty item (default: '------') */
  emptyItemLabel?: string;
  /** dropdown items */
  children?: React.ReactNode;
} & TextFieldProps;

const CustomDropdown: React.FC<Props> = ({
  children,
  id,
  value,
  name,
  label,
  onChange,
  fullWidth,
  sx,
  size,
  margin,
  emptyStateMessage = 'Non ci sono elementi',
  error,
  helperText,
  required = true,
  emptyItemKey = '',
  emptyItemValue = '',
  emptyItemLabel = '------',
  disabled,
}) => {
  const [innerValue, setInnerValue] = useState(value);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInnerValue((event.target as any).value);
    if (onChange) {
      onChange(event);
    }
  };

  useEffect(() => {
    if (value !== innerValue) {
      setInnerValue(value);
    }
  }, [value]);

  return (
    <>
      {children ? (
        <TextField
          id={id}
          value={innerValue}
          name={name}
          label={label}
          fullWidth={fullWidth}
          onChange={changeHandler}
          sx={sx}
          select
          size={size}
          margin={margin}
          error={error}
          helperText={helperText}
          disabled={disabled}
          required={required}
        >
          {!required && (
            <MenuItem key={emptyItemKey} value={emptyItemValue}>
              {emptyItemLabel}
            </MenuItem>
          )}
          {children}
        </TextField>
      ) : (
        <TextField
          id={id}
          name={name}
          disabled
          placeholder={emptyStateMessage}
          InputLabelProps={{ shrink: true }}
          size="small"
          margin="normal"
          label={label}
          fullWidth={fullWidth}
        />
      )}
    </>
  );
};

export default CustomDropdown;
