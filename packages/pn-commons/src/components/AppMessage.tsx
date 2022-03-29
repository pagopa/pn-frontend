import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { appStateActions, appStateSelectors } from '../redux/slices/appStateSlice';
import { IAppMessage } from '../types/AppMessage';
import Toast from './Toast/Toast';
import { MessageType } from '../types/MessageType';

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
      {errors.map((e: IAppMessage) => (
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
      {success.map((e: IAppMessage) => (
        <Toast
          key={e.id}
          title={e.title}
          message={e.message}
          open
          type={MessageType.SUCCESS}
          onClose={() => onCloseSuccessToast(e.id)}
          closingDelay={2500}
        />
      ))}
    </Fragment>
  );
};

export default AppMessage;
