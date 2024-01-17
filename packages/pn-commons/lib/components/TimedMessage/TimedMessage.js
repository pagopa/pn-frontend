import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
const TimedMessage = ({ timeout = 0, callback, children }) => {
    const [showMessage, setShowMessage] = useState(false);
    useEffect(() => {
        if (timeout > 0) {
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
                if (typeof callback === 'function') {
                    callback();
                }
            }, timeout);
        }
    }, [timeout]);
    return _jsx(_Fragment, { children: showMessage && _jsx(Box, { "data-testid": "timed-message", children: children }) });
};
export default TimedMessage;
