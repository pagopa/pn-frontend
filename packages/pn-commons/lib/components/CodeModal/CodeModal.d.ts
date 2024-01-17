import { ReactNode } from 'react';
type Props = {
    title: ReactNode;
    subtitle: ReactNode;
    open: boolean;
    initialValues: Array<string>;
    codeSectionTitle: string;
    codeSectionAdditional?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    cancelCallback?: () => void;
    confirmCallback?: (values: Array<string>) => void;
    isReadOnly?: boolean;
    hasError?: boolean;
    errorTitle?: string;
    errorMessage?: string;
};
/**
 * This modal allows the user to input a verification code.
 * @param title title to show
 * @param subtitle subtitle to show
 * @param open flag to hide/show modal
 * @param initialValues initial code
 * @param codeSectionTitle title of the section where is the code
 * @param codeSectionAdditional additional elments under the code
 * @param confirmLabel label of the confirm button
 * @param cancelLabel label of the cancel button
 * @param isReadOnly set if code is in readonly mode
 * @param hasError set if there is an error
 * @param errorTitle title to show when there is an error
 * @param errorMessage message to show when there is an error
 */
declare const CodeModal: import("react").MemoExoticComponent<({ title, subtitle, open, initialValues, codeSectionTitle, codeSectionAdditional, confirmLabel, cancelLabel, cancelCallback, confirmCallback, isReadOnly, hasError, errorTitle, errorMessage, }: Props) => JSX.Element>;
export default CodeModal;
