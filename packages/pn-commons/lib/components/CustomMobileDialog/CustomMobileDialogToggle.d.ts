/// <reference types="react" />
import { SxProps, Theme } from '@mui/material/styles';
type Props = {
    sx?: SxProps<Theme>;
    hasCounterBadge?: boolean;
    bagdeCount?: number;
};
/**
 * Button to open/close dialog
 * @param children the react component for the button
 * @param hasCounterBadge add counter near the button
 * @param bagdeCount number to display into the counter
 * @param sx style to be addded to the button
 */
declare const CustomMobileDialogToggle: React.FC<Props>;
export default CustomMobileDialogToggle;
