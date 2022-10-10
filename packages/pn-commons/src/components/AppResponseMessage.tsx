import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { appStateActions } from '../redux';

import { AppResponsePublisher } from '../utils/AppResponse';
import { AppResponse } from '../types/AppResponse';

const AppResponseMessage = () => {
  const dispatch = useDispatch();
  
  const showErrorMessage = (response: AppResponse) => {
    const { errors, action } = response;
    
    errors?.forEach(error => {
      dispatch(
        appStateActions.addError({
          title: error.message.title,
          message:error.message.content,
          action
        }),
      );
    });
  };

  // const showSuccessMessage = (response: AppResponse) => {
  //   console.log("Operazione eseguita correttamente");
  //   console.log(response);
  // };

  useEffect(() => {
    AppResponsePublisher.error.subscribe(showErrorMessage);
    // AppResponsePublisher.success.subscribe(showSuccessMessage);
    // AppResponsePublisher.success.subscribe('getReceivedNotifications', showSuccessMessage);
    
    return () => {
      AppResponsePublisher.error.unsubscribe(showErrorMessage);
      // AppResponsePublisher.success.unsubscribe(showSuccessMessage);
      // AppResponsePublisher.success.unsubscribe('getReceivedNotifications', showSuccessMessage);
    };
  }, []);

  return <></>;
};

export default AppResponseMessage;
