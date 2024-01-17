import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, } from 'react';
const SpecialContactsContext = createContext(undefined);
const SpecialContactsProvider = ({ children }) => {
    const [contextEditMode, setContextEditMode] = useState(false);
    return (_jsx(SpecialContactsContext.Provider, { value: { contextEditMode, setContextEditMode }, children: children }));
};
const useSpecialContactsContext = () => {
    const context = useContext(SpecialContactsContext);
    if (context === undefined) {
        throw new Error('useSpecialContactsContext must be used within a SpecialContactsProvider');
    }
    return context;
};
export { SpecialContactsProvider, useSpecialContactsContext };
