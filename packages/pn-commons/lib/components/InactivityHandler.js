import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment, useEffect, useState } from 'react';
const InactivityHandler = ({ inactivityTimer, children, onTimerExpired }) => {
    const [initTimeout, setInitTimeout] = useState(true);
    const resetTimer = () => setInitTimeout(!initTimeout);
    const initListeners = () => {
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('scroll', resetTimer);
        window.addEventListener('keydown', resetTimer);
    };
    const cleanUpListeners = () => {
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('scroll', resetTimer);
        window.removeEventListener('keydown', resetTimer);
    };
    // init timer
    useEffect(() => {
        // init listeners
        initListeners();
        // init timer
        const timer = setTimeout(() => {
            cleanUpListeners();
            onTimerExpired();
        }, inactivityTimer);
        // cleanup function
        return () => {
            clearTimeout(timer);
            cleanUpListeners();
        };
    }, [initTimeout]);
    return _jsx(Fragment, { children: children });
};
export default InactivityHandler;
