/// <reference types="react" />
import { MessageType } from '../../models/MessageType';
type Props = {
    /** whether the sneakbar should be open or not */
    open: boolean;
    /** message type (error, success, info, warning) */
    type: MessageType;
    /** title to be shown */
    title?: React.ReactNode;
    /** message to be shown */
    message: React.ReactNode;
    /** A closing delay: if specified the sneakbar would close itself */
    closingDelay?: number;
    /** onClose action */
    onClose?: () => void;
    /** Alert variant */
    variant?: 'outlined' | 'standard' | 'filled';
};
declare const SnackBar: React.FC<Props>;
export default SnackBar;
