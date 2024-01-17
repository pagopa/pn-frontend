/// <reference types="react" />
type Props = {
    title: string;
    message: string;
    eventTrackingCallbackPromptOpened: () => void;
    eventTrackingCallbackCancel: () => void;
    eventTrackingCallbackConfirm: () => void;
    children?: React.ReactNode;
};
declare const Prompt: React.FC<Props>;
export default Prompt;
