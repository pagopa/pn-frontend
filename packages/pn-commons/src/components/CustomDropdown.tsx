import { ChangeEvent, useEffect, useState } from 'react';
import { TextField, SxProps, MenuItem } from '@mui/material';

type Props = {
  /** id */
  id: string;
  /** value */
  value: any;
  /** name */
  name?: string;
  /** label */
  label?: string;
  /** on change event handler */
  onChange?: (e?: any) => void;
  /** set to true to have full width dropdown */
  fullWidth?: boolean;
  /** style costumization */
  sx?: SxProps;
  /** size option */
  size?: 'small' | 'medium';
  /** margin option */
  margin?: 'none' | 'dense' | 'normal';
  /** empty message when no items are available */
  emptyStateMessage?: string;
  /** error status toggle */
  error?: boolean;
  /** helper text context */
  helperText?: string | false;
  /** required toggle (default: true) */
  required?: boolean;
  /** map value string for empty item (default: empty string) */
  emptyItemValue?: string;
  /** map key string for empty item (default: empty string) */
  emptyItemKey?: string;
  /** map label string for empty item (default: '------') */
  emptyItemLabel?: string;
};

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
}) => {
  const [innerValue, setInnerValue] = useState(value);

  const changeHandler = (event: ChangeEvent) => {
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
