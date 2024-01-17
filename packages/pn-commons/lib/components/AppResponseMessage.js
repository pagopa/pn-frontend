import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { appStateActions } from '../redux';
import { AppResponsePublisher } from '../utility/AppResponse';
const AppResponseMessage = ({ eventTrackingToastErrorMessages }) => {
    const dispatch = useDispatch();
    const showErrorMessage = (response) => {
        const { errors, action, traceId } = response;
        errors?.forEach((error) => {
            if (eventTrackingToastErrorMessages) {
                eventTrackingToastErrorMessages(error, traceId);
            }
            dispatch(appStateActions.addError({
                title: error.message.title,
                message: error.message.content,
                action,
            }));
        });
    };
    useEffect(() => {
        AppResponsePublisher.error.subscribe(showErrorMessage);
        return () => {
            AppResponsePublisher.error.unsubscribe(showErrorMessage);
        };
    }, []);
    return _jsx(_Fragment, {});
};
export default AppResponseMessage;
