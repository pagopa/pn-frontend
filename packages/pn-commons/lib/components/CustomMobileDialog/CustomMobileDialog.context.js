import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const CustomMobileDialogContext = createContext(undefined);
const CustomMobileDialogProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => {
        setOpen(!open);
    };
    return (_jsx(CustomMobileDialogContext.Provider, { value: { open, toggleOpen }, children: children }));
};
const useCustomMobileDialogContext = () => {
    const context = useContext(CustomMobileDialogContext);
    if (context === undefined) {
        throw new Error('useCustomMobileDialogContext must be used within a CustomMobileDialogProvider');
    }
    return context;
};
export { CustomMobileDialogProvider, useCustomMobileDialogContext };
