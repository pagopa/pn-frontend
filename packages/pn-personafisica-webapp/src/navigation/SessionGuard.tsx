/* eslint-disable functional/immutable-data */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  AppResponsePublisher,
  AppRouteParams,
  InactivityHandler,
  LoadingPage,
  SessionModal,
  adaptedTokenExchangeError,
  isJwtExpired,
  useErrors,
  useSessionCheck,
} from '@pagopa-pn/pn-commons';

import { useRapidAccessParam } from '../hooks/useRapidAccessParam';
import { OneIdentityCodeExchangeRequest, TokenExchangeRequest } from '../models/User';
import { apiLogout, exchangeOneIdentityCode, exchangeToken } from '../redux/auth/actions';
import { resetState } from '../redux/auth/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import { AAR_UTM, buildSearchWithUtm } from '../utility/utm.utility';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

const SessionGuard = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const rapidAccess = useRapidAccessParam();
  const { loading, loginProvider } = useAppSelector((state: RootState) => state.userState);
  const { sessionToken, exp } = useAppSelector((state: RootState) => state.userState.user);
  const navigate = useNavigate();
  const { WORK_IN_PROGRESS, INACTIVITY_HANDLER_MINUTES } = getConfiguration();
  const sessionCheck = useSessionCheck(200, () => sessionCheckCallback());
  const { t } = useTranslation(['common']);
  const { hasSpecificStatusError } = useErrors();
  const hasAnyForbiddenError = hasSpecificStatusError(403);

  const aarSearchWithUtm =
    rapidAccess?.[0] === AppRouteParams.AAR
      ? buildSearchWithUtm(location.search, AAR_UTM, { avoidOverride: true })
      : null;

  const [modalData, setModalData] = useState({
    open: false,
    title: '',
    message: '',
  });

  const hashParams = new URLSearchParams(location.hash.substring(1)); // https://github.com/remix-run/history/blob/main/docs/api-reference.md#location.hash

  const spidToken = hashParams.get('token');

  // Get One Identity params from URL hash
  const code = hashParams.get('code');
  const state = hashParams.get('state');
  const nonce = hashParams.get('nonce');
  const redirectUri = hashParams.get('redirect_uri');

  const handleTokenExchangeError = (error: any) => {
    const adaptedError = adaptedTokenExchangeError(error);
    if (adaptedError.response.status === 451 || WORK_IN_PROGRESS) {
      navigate({ pathname: routes.NOT_ACCESSIBLE }, { replace: true });
      return;
    }
    if (adaptedError.code === 'USER_VALIDATION_FAILED') {
      navigate(
        {
          pathname: routes.NOT_ACCESSIBLE,
          search: '?reason=user-validation-failed',
        },
        { replace: true }
      );
      return;
    }
    setModalData({
      open: true,
      title: adaptedError.response.customMessage.title,
      message: adaptedError.response.customMessage.message,
    });
  };

  const performExchangeToken = async (token: TokenExchangeRequest) => {
    AppResponsePublisher.error.subscribe('exchangeToken', manageUnforbiddenError);
    try {
      const user = await dispatch(exchangeToken(token)).unwrap();
      sessionCheck(user.exp);
    } catch (error) {
      handleTokenExchangeError(error);
    }
  };

  const performOneIdentityTokenExchange = async (
    exchangeCodeParams: OneIdentityCodeExchangeRequest
  ) => {
    AppResponsePublisher.error.subscribe('exchangeTokenOneIdentity', manageUnforbiddenError);
    try {
      const user = await dispatch(exchangeOneIdentityCode(exchangeCodeParams)).unwrap();
      sessionCheck(user.exp);
    } catch (error) {
      handleTokenExchangeError(error);
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
    goToLoginPortal({ loginProvider, search: location.search });
  };

  useEffect(() => {
    if (aarSearchWithUtm?.changed) {
      navigate(
        {
          pathname: location.pathname,
          search: aarSearchWithUtm.search,
          hash: location.hash,
        },
        { replace: true }
      );
    }
  }, [
    aarSearchWithUtm?.changed,
    aarSearchWithUtm?.search,
    location.pathname,
    location.hash,
    navigate,
  ]);

  useEffect(() => {
    if (aarSearchWithUtm?.changed) {
      return;
    }
    if (spidToken) {
      void performExchangeToken({ spidToken, rapidAccess });
    } else if (code && state && nonce && redirectUri) {
      void performOneIdentityTokenExchange({
        code,
        state,
        nonce,
        redirectUri: decodeURIComponent(redirectUri),
        rapidAccess,
      });
    } else if (sessionToken) {
      sessionCheck(exp);
    } else {
      goToLoginPortal({
        rapidAccess,
        loginProvider,
        search: aarSearchWithUtm?.search ?? location.search,
      });
    }

    return () => {
      AppResponsePublisher.error.unsubscribe('exchangeToken', manageUnforbiddenError);
      AppResponsePublisher.error.unsubscribe('exchangeTokenOneIdentity', manageUnforbiddenError);
    };
  }, [
    aarSearchWithUtm?.changed,
    aarSearchWithUtm?.search,
    spidToken,
    code,
    state,
    nonce,
    redirectUri,
    location.search,
  ]);

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
