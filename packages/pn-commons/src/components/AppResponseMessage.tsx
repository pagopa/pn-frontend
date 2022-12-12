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

  useEffect(() => {
    AppResponsePublisher.error.subscribe(showErrorMessage);
    
    return () => {
      AppResponsePublisher.error.unsubscribe(showErrorMessage);
    };
  }, []);

  return <></>;
};

export default AppResponseMessage;
