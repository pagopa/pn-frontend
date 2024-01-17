/// <reference types="react" />
type Props = {
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel: string;
    title?: string;
    content?: string;
    checkboxLabel?: string;
};
declare const DisclaimerModal: React.FC<Props>;
export default DisclaimerModal;
