import { ReactNode } from 'react';
type Props = {
    children: ReactNode;
    title: string;
};
/**
 * The content of the dialog (header, body and actions)
 * @param children the react component for the body and the actions
 * @param title title to show in the dialog header
 */
declare const CustomMobileDialogContent: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<{
    toggleOpen: () => void;
}>>;
export default CustomMobileDialogContent;
