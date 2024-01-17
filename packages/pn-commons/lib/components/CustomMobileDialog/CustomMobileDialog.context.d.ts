import { FC, ReactNode } from 'react';
interface ICustomMobileDialogContext {
    open: boolean;
    toggleOpen: () => void;
}
declare const CustomMobileDialogProvider: FC<ReactNode>;
declare const useCustomMobileDialogContext: () => ICustomMobileDialogContext;
export { CustomMobileDialogProvider, useCustomMobileDialogContext };
