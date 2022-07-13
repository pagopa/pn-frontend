import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { appStateActions, appStateSelectors } from '../redux/slices/appStateSlice';
import { IAppMessage } from '../types';
import { MessageType } from '../types';
import SessionModal from './SessionModal';
import Toast from './Toast/Toast';

type Props = {
  sessionRedirect?: () => void;
};

const AppMessage = ({ sessionRedirect }: Props) => {
  const dispatch = useDispatch();
  const errors = useSelector(appStateSelectors.selectErrors);
  const success = useSelector(appStateSelectors.selectSuccess);
  const [open, setOpen] = useState(true);

  const onCloseErrorToast = (id: string) => {
    dispatch(appStateActions.removeError(id));
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
      {errors.map((errorMessage: IAppMessage) =>
        errorMessage.status === 403 ? (
          <SessionModal
            open={open}
            key={errorMessage.id}
            title={errorMessage.title}
            message={errorMessage.message}
            handleClose={handleSessionModalClose}
            onConfirm={handleSessionModalClose}
            onConfirmLabel={"Entra"}
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
