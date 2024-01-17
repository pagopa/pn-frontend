/// <reference types="react" />
import { SxProps } from '@mui/material';
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
declare const CustomDropdown: React.FC<Props>;
export default CustomDropdown;
