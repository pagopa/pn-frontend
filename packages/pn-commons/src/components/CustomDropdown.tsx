import { ReactNode } from 'react';
import { TextField, SxProps, MenuItem } from '@mui/material';

type Props = {
  /** children wrapper */
  children?: ReactNode;
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
  size?: "small" | "medium";
  /** margin option */
  margin?: "none" | "dense" | "normal";
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

const CustomDropdown = ({
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
}: Props) => (
  <>
    {children ? (
      <TextField
        id={id}
        value={value}
        name={name}
        label={label}
        fullWidth={fullWidth}
        onChange={onChange}
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
export default CustomDropdown;