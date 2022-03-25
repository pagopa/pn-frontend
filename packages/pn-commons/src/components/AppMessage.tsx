import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { appStateActions } from '../redux/slices/appStateSlice';
import { AppError } from '../types/AppError';
import Toast from './Toast/Toast';
import { MessageType } from '../types/MessageType';

const AppMessage = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state: any) => state.appState.errors);

  const onCloseErrorToast = (id: string) => {
    dispatch(appStateActions.removeError(id));
  };

  return (
    <Fragment>
      {errors.map((e: AppError) => (
        <Toast
          key={e.id}
          title={e.title}
          message={e.message}
          open
          type={MessageType.ERROR}
          onClose={() => onCloseErrorToast(e.id)}
          closingDelay={2500}
        />
      ))}
    </Fragment>
  );
};

export default AppMessage;
