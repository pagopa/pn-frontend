import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AppResponse, AppResponseError } from '../models/AppResponse';
import { appStateActions } from '../redux';
import { AppResponsePublisher } from '../utility/AppResponse';

/**
 * AppResponseMessage that subscribes to error messages using an AppResponsePublisher
 * and dispatches those error messages to the Redux store using useDispatch from react-redux.
 * This component is designed to display error messages in your React application.
 * Make sure that you have the necessary Redux setup and reducers in place for this code to work correctly.
 * @returns {any}
 */
type Props = {
  eventTrackingToastErrorMessages?: (error: AppResponseError, response: AppResponse) => void;
};
const AppResponseMessage = ({ eventTrackingToastErrorMessages }: Props) => {
  const dispatch = useDispatch();

  const showErrorMessage = (response: AppResponse) => {
    const { errors, action, status } = response;

    errors?.forEach((error) => {
      if (eventTrackingToastErrorMessages) {
        eventTrackingToastErrorMessages(error, response);
      }
      dispatch(
        appStateActions.addError({
          title: error.message.title,
          message: error.message.content,
          permanent: error.permanent,
          status,
          action,
        })
      );
    });
  };

  useEffect(() => {
    AppResponsePublisher.error.subscribe(showErrorMessage);

    return () => {
      AppResponsePublisher.error.unsubscribe(showErrorMessage);
    };
  }, []);

  return <></>;
};

export default AppResponseMessage;
