/// <reference types="react" />
type Props = {
    /** Inactivity timer (in milliseconds) */
    inactivityTimer: number;
    /** Callback called when timer expires */
    onTimerExpired: () => void;
    children?: React.ReactNode;
};
declare const InactivityHandler: React.FC<Props>;
export default InactivityHandler;
