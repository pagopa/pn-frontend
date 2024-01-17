import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { TextField, MenuItem } from '@mui/material';
const CustomDropdown = ({ children, id, value, name, label, onChange, fullWidth, sx, size, margin, emptyStateMessage = 'Non ci sono elementi', error, helperText, required = true, emptyItemKey = '', emptyItemValue = '', emptyItemLabel = '------', }) => {
    const [innerValue, setInnerValue] = useState(value);
    const changeHandler = (event) => {
        setInnerValue(event.target.value);
        if (onChange) {
            onChange(event);
        }
    };
    useEffect(() => {
        if (value !== innerValue) {
            setInnerValue(value);
        }
    }, [value]);
    return (_jsx(_Fragment, { children: children ? (_jsxs(TextField, { id: id, value: innerValue, name: name, label: label, fullWidth: fullWidth, onChange: changeHandler, sx: sx, select: true, size: size, margin: margin, error: error, helperText: helperText, children: [!required && (_jsx(MenuItem, { value: emptyItemValue, children: emptyItemLabel }, emptyItemKey)), children] })) : (_jsx(TextField, { id: id, name: name, disabled: true, placeholder: emptyStateMessage, InputLabelProps: { shrink: true }, size: "small", margin: "normal", label: label, fullWidth: fullWidth })) }));
};
export default CustomDropdown;
