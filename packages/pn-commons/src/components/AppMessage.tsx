import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { appStateActions, appStateSelectors } from '../redux/slices/appStateSlice';
import { IAppMessage } from '../types/AppMessage';
import { MessageType } from '../types/MessageType';
import Toast from './Toast/Toast';

const AppMessage = () => {
  const dispatch = useDispatch();
  const errors = useSelector(appStateSelectors.selectErrors);
  const success = useSelector(appStateSelectors.selectSuccess);

  const onCloseErrorToast = (id: string) => {
    dispatch(appStateActions.removeError(id));
  };

  const onCloseSuccessToast = (id: string) => {
    dispatch(appStateActions.removeSuccess(id));
  };

  return (
    <Fragment>
      {errors.map((errorMessage: IAppMessage) => (
        <Toast
          key={errorMessage.id}
          title={errorMessage.title}
          message={errorMessage.message}
          open
          type={MessageType.ERROR}
          onClose={() => onCloseErrorToast(errorMessage.id)}
          closingDelay={2500}
        />
      ))}
      {success.map((successMessage: IAppMessage) => (
        <Toast
          key={successMessage.id}
          title={successMessage.title}
          message={successMessage.message}
          open
          type={MessageType.SUCCESS}
          onClose={() => onCloseSuccessToast(successMessage.id)}
          closingDelay={2500}
        />
      ))}
      {success.map((errorMessage: IAppMessage) => (
        <Toast
          key={errorMessage.id}
          title={errorMessage.title}
          message={errorMessage.message}
          open
          type={MessageType.SUCCESS}
          onClose={() => onCloseSuccessToast(errorMessage.id)}
          closingDelay={2500}
        />
      ))}
    </Fragment>
  );
};

export default AppMessage;
