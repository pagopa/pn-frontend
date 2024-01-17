import { useEffect, useState } from 'react';
export const useMultiEvent = (props) => {
    const { callback, count = 5, interval = 250 } = props;
    const [eventCount, setEventCount] = useState(0);
    useEffect(() => {
        if (eventCount >= count) {
            setEventCount(0);
            callback();
        }
        else if (eventCount !== 0) {
            const timer = setTimeout(() => {
                setEventCount(0);
            }, interval);
            return () => {
                clearTimeout(timer);
            };
        }
        return;
    }, [eventCount]);
    const onEvent = () => {
        setEventCount((prevState) => prevState + 1);
    };
    return [onEvent];
};
