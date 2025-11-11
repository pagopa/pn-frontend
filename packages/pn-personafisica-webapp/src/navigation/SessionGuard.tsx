/* eslint-disable functional/immutable-data */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  AppResponsePublisher,
  InactivityHandler,
  LoadingPage,
  SessionModal,
  adaptedTokenExchangeError,
  isJwtExpired,
  useErrors,
  useSessionCheck,
} from '@pagopa-pn/pn-commons';

import { useRapidAccessParam } from '../hooks/useRapidAccessParam';
import { TokenExchangeRequest } from '../models/User';
import { apiLogout, exchangeToken } from '../redux/auth/actions';
import { resetState } from '../redux/auth/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

const SessionGuard = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const rapidAccess = useRapidAccessParam();
  const { loading } = useAppSelector((state: RootState) => state.userState);
  const { sessionToken, exp } = useAppSelector((state: RootState) => state.userState.user);
  const navigate = useNavigate();
  const { WORK_IN_PROGRESS, INACTIVITY_HANDLER_MINUTES } = getConfiguration();
  const sessionCheck = useSessionCheck(200, () => sessionCheckCallback());
  const { t } = useTranslation(['common']);
  const { hasSpecificStatusError } = useErrors();
  const hasAnyForbiddenError = hasSpecificStatusError(403);

  const [modalData, setModalData] = useState({
    open: false,
    title: '',
    message: '',
  });

  const spidToken = new URLSearchParams(location.hash.substring(1)).get('token'); // https://github.com/remix-run/history/blob/main/docs/api-reference.md#location.hash

  const performExchangeToken = async (token: TokenExchangeRequest) => {
    AppResponsePublisher.error.subscribe('exchangeToken', manageUnforbiddenError);
    try {
      const user = await dispatch(exchangeToken(token)).unwrap();

      // store user in sessionStorage only on successful validation
      sessionStorage.setItem('user', JSON.stringify(user));

      sessionCheck(user.exp);
    } catch (error) {
      const adaptedError = adaptedTokenExchangeError(error);
      if (adaptedError.response.status === 451 || WORK_IN_PROGRESS) {
        navigate({ pathname: routes.NOT_ACCESSIBLE }, { replace: true });
        return;
      }
      if (adaptedError.code === 'USER_VALIDATION_FAILED') {
        navigate({ pathname: routes.USER_VALIDATION_FAILED }, { replace: true });
        return;
      }
      setModalData({
        open: true,
        title: adaptedError.response.customMessage.title,
        message: adaptedError.response.customMessage.message,
      });
    }
  };

  const sessionCheckCallback = () => {
    setModalData({
      open: true,
      title: t('leaving-app.title'),
      message: t('leaving-app.message'),
    });
  };

  const manageUnforbiddenError = (e: any) => {
    if (e.status === 451) {
      // error toast must not be shown
      return false;
    }
    return true;
  };

  const exit = async () => {
    if (sessionToken && !isJwtExpired(exp)) {
      await dispatch(apiLogout(sessionToken));
    }

    dispatch(resetState());
    goToLoginPortal();
  };

  useEffect(() => {
    if (spidToken) {
      void performExchangeToken({ spidToken, rapidAccess });
    } else if (sessionToken) {
      sessionCheck(exp);
    } else {
      goToLoginPortal(rapidAccess);
    }

    return () => {
      AppResponsePublisher.error.unsubscribe('exchangeToken', manageUnforbiddenError);
    };
  }, []);

  useEffect(() => {
    if (hasAnyForbiddenError) {
      void exit();
    }
  }, [hasAnyForbiddenError]);

  return (
    <>
      {loading ? (
        <LoadingPage renderType="whole" />
      ) : (
        <>
          <SessionModal {...modalData} handleClose={() => exit()} initTimeout />
          <InactivityHandler
            inactivityTimer={INACTIVITY_HANDLER_MINUTES * 60 * 1000}
            onTimerExpired={() => exit()}
          />
          <Outlet />
        </>
      )}
    </>
  );
};

export default SessionGuard;
