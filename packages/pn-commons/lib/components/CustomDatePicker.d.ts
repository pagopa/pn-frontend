/// <reference types="react" />
import { DesktopDatePickerProps } from '@mui/x-date-pickers';
export type DatePickerTypes = Date | null;
declare const CustomDatePicker: (props: DesktopDatePickerProps<DatePickerTypes, DatePickerTypes> & React.RefAttributes<HTMLDivElement> & {
    language?: string;
}) => JSX.Element;
export default CustomDatePicker;
