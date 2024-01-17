import { MouseEventHandler } from 'react';
type Props = {
    open: boolean;
    title: string;
    message: React.ReactNode;
    onConfirm?: MouseEventHandler<HTMLButtonElement>;
    onConfirmLabel?: string;
    handleClose?: () => void;
    initTimeout?: boolean;
};
/**
 * Session Modal to handle end of session or unauthenticated scenarios.
 * @param open boolean - if modal is open or no
 * @param title string - title of the modal
 * @param message string - message to show inside the modal
 * @param onConfirm action to perform when user click on "confirm" button
 * @param onConfirmLabel label to show on confirm button, default is "Riprova"
 * @param handleClose action to perform when closing modal when clicking outside of it
 * @param initTimeout init timeout after which modal close
 */
declare const SessionModal: React.FC<Props>;
export default SessionModal;
