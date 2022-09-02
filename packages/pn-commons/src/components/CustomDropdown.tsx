import { ChangeEvent } from 'react';
import { TextField, SxProps, MenuItem } from '@mui/material';

type Props = {
  /** id */
  id: string;
  /** value */
  value: any;
  /** name */
  name: string;
  /** label */
  label?: string;
  /** on change event handler */
  onChange?: (e: ChangeEvent) => void;
  /** set to true to have full width dropdown */
  fullWidth?: boolean;
  /** style costumization */
  sx?: SxProps;
  /** empty message when no items are available */
  emptyState?: string;
  /** items for dropdown */
  items: Array<CustomDropdownItemType> | undefined;
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

export interface CustomDropdownItemType {
  key: string;
  value: string;
  label: string;
}

export const CustomDropdown = ({
  id,
  value,
  name,
  label,
  onChange,
  fullWidth,
  sx,
  emptyState = 'Non ci sono elementi',
  items,
  error,
  helperText,
  required = true,
  emptyItemKey = '',
  emptyItemValue = '',
  emptyItemLabel = '------',
}: Props) => (
  <>
    {items && items.length > 0 ? (
      <TextField
        id={id}
        value={value}
        name={name}
        label={label}
        fullWidth={fullWidth}
        onChange={onChange}
        sx={sx}
        select
        size="small"
        margin="normal"
        error={error}
        helperText={helperText}
      >
        {!required && (
          <MenuItem key={emptyItemKey} value={emptyItemValue}>
            {emptyItemLabel}
          </MenuItem>
        )}
        {items.map((item: CustomDropdownItemType) => (
          <MenuItem key={item.key} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </TextField>
    ) : (
      <>
        <TextField 
          id={id}
          name={name}
          disabled
          placeholder={emptyState}
          InputLabelProps={{ shrink: true }}
          size="small"
          margin="normal"
          label={label}
          fullWidth={fullWidth}
        />
      </>
    )}
  </>
);