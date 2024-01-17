/// <reference types="react" />
interface TimedMessageProps {
    /** Set timeout in milliseconds */
    timeout: number;
    /** Callback function when timeout reachs end */
    callback?: () => void;
    /** Message to show */
    children?: React.ReactNode;
}
declare const TimedMessage: React.FC<TimedMessageProps>;
export default TimedMessage;
