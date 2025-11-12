import { useCallback, useEffect, useState } from 'react';

import { AppResponse, AppResponsePublisher } from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { NOTIFICATION_ACTIONS, getReceivedNotification } from '../redux/notification/actions';
import { resetState } from '../redux/notification/reducers';
import { RootState } from '../redux/store';
import { ServerResponseErrorCode } from '../utility/AppError/types';

const useNotificationAccess = (id?: string, mandateId?: string) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const delegatorsFromStore = useAppSelector(
    (state: RootState) => state.generalInfoState.delegators
  );

  const [pageReady, setPageReady] = useState(false);
  const [isUserValid, setIsUserValid] = useState(true);

  const fetchReceivedNotification = useCallback(() => {
    if (id) {
      dispatch(
        getReceivedNotification({
          iun: id,
          currentUserTaxId: currentUser.fiscal_number,
          delegatorsFromStore,
          mandateId,
        })
      )
        .unwrap()
        .catch((error) => {
          if (
            error?.response?.data?.errors?.[0]?.code ===
            ServerResponseErrorCode.PN_DELIVERY_USER_ID_NOT_RECIPIENT_OR_DELEGATOR
          ) {
            setIsUserValid(false);
          }
        })
        .finally(() => {
          setPageReady(true);
        });
    }
  }, [id, currentUser.fiscal_number, delegatorsFromStore, mandateId]);

  const handleUserInvalidError = useCallback((e: AppResponse) => {
    const error = e.errors?.[0];
    return error?.code !== ServerResponseErrorCode.PN_DELIVERY_USER_ID_NOT_RECIPIENT_OR_DELEGATOR;
  }, []);

  useEffect(() => {
    fetchReceivedNotification();
    return () => void dispatch(resetState());
  }, []);

  useEffect(() => {
    AppResponsePublisher.error.subscribe(
      NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION,
      handleUserInvalidError
    );

    return () => {
      AppResponsePublisher.error.unsubscribe(
        NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION,
        handleUserInvalidError
      );
    };
  }, [handleUserInvalidError]);

  return {
    pageReady,
    isUserValid,
    fetchReceivedNotification,
  };
};

export default useNotificationAccess;
