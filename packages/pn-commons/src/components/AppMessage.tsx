import { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { appStateActions } from '../redux';

import { AppResponsePublisher } from '../utils/AppResponse';
// import { useDispatch, useSelector } from 'react-redux';
// import { appStateActions, appStateSelectors } from '../redux';
import { getLocalizedOrDefaultLabel } from '../services/localization.service';
import { IAppMessage, MessageType } from '../types';
import { AppResponse } from '../types/AppResponse';
import SessionModal from './SessionModal';
import Toast from './Toast/Toast';

type Props = {
  sessionRedirect?: () => void;
};

const AppMessage = ({ sessionRedirect }: Props) => {
  const dispatch = useDispatch();
  // const errors = useSelector(appStateSelectors.selectErrors);
  const [errors, setErrors] = useState<Array<IAppMessage>>([]);
  // const success = useSelector(appStateSelectors.selectSuccess);
  const success: Array<IAppMessage> = [];
  const [open, setOpen] = useState(true);

  const testPublishMessage = (response: AppResponse) => {
    const errors = response.errors || [];
    const appMessages = errors.map(error => ({
      id: "a",
      blocking: false,
      message: error.getMessage().message,
      title: error.getMessage().title,
      toNotify: true,
      alreadyShown: false
    }));
    setErrors(appMessages);
  };

  useEffect(() => {
    AppResponsePublisher.subscribe(testPublishMessage);
    
    return () => AppResponsePublisher.unsubscribe(testPublishMessage);
  }, []);

  const onCloseErrorToast = (id: string) => {
    // dispatch(appStateActions.removeError(id));
    dispatch(appStateActions.setErrorAsAlreadyShown(id));
  };

  const onCloseSuccessToast = (id: string) => {
    dispatch(appStateActions.removeSuccess(id));
  };

  const handleSessionModalClose = () => {
    setOpen(false);
    sessionRedirect && sessionRedirect();
  };

  return (
    <Fragment>
      {errors.filter((errorMessage: IAppMessage) => !errorMessage.alreadyShown).map((errorMessage: IAppMessage) =>
        errorMessage.status === 403 ? (
          <SessionModal
            open={open}
            key={errorMessage.id}
            title={errorMessage.title}
            message={errorMessage.message}
            handleClose={handleSessionModalClose}
            onConfirm={handleSessionModalClose}
            onConfirmLabel={getLocalizedOrDefaultLabel('common', 'button.enter', 'Entra')}
          />
        ) : (
          <Toast
            key={errorMessage.id}
            title={errorMessage.title}
            message={errorMessage.message}
            open
            type={MessageType.ERROR}
            onClose={() => onCloseErrorToast(errorMessage.id)}
            closingDelay={5000}
          />
        )
      )}
      {success.map((successMessage: IAppMessage) => (
        <Toast
          key={successMessage.id}
          title={successMessage.title}
          message={successMessage.message}
          open
          type={MessageType.SUCCESS}
          onClose={() => onCloseSuccessToast(successMessage.id)}
          closingDelay={5000}
        />
      ))}
    </Fragment>
  );
};

export default AppMessage;
