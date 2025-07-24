/* eslint-disable functional/immutable-data */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  InactivityHandler,
  LoadingPage,
  SessionModal,
  adaptedTokenExchangeError,
  useErrors,
  useSessionCheck,
} from '@pagopa-pn/pn-commons';

import { useRapidAccessParam } from '../hooks/useRapidAccessParam';
import { TokenExchangeRequest } from '../models/User';
import { exchangeToken } from '../redux/auth/actions';
import { resetState } from '../redux/auth/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

const inactivityTimer = 5 * 60 * 1000;

const SessionGuard = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const rapidAccess = useRapidAccessParam();
  const { loading } = useAppSelector((state: RootState) => state.userState);
  const { sessionToken, exp } = useAppSelector((state: RootState) => state.userState.user);
  const navigate = useNavigate();
  const { WORK_IN_PROGRESS, IS_INACTIVITY_HANDLER_ENABLED } = getConfiguration();
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
    try {
      await dispatch(exchangeToken(token)).unwrap();
      sessionCheck(exp);
    } catch (error) {
      const adaptedError = adaptedTokenExchangeError(error);
      if (adaptedError.response.status === 451 || WORK_IN_PROGRESS) {
        navigate({ pathname: routes.NOT_ACCESSIBLE }, { replace: true });
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

  useEffect(() => {
    if (spidToken) {
      void performExchangeToken({ spidToken, rapidAccess });
    } else if (sessionToken) {
      sessionCheck(exp);
    } else {
      goToLoginPortal(rapidAccess);
    }
  }, []);

  useEffect(() => {
    if (hasAnyForbiddenError) {
      exit();
    }
  }, [hasAnyForbiddenError]);

  const exit = () => {
    sessionStorage.clear();
    void dispatch(resetState());
    goToLoginPortal();
  };

  return (
    <>
      <SessionModal {...modalData} handleClose={() => exit()} initTimeout />
      {loading ? (
        <LoadingPage renderType="whole" />
      ) : (
        <>
          {IS_INACTIVITY_HANDLER_ENABLED && (
            <InactivityHandler
              inactivityTimer={inactivityTimer}
              onTimerExpired={() => exit()}
            />
          )}
          <Outlet />
        </>
      )}
    </>
  );
};

export default SessionGuard;
