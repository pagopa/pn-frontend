import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import {
  AppResponsePublisher,
  AppRouteParams,
  InactivityHandler,
  LoadingPage,
  SessionModal,
  adaptedTokenExchangeError,
  sanitizeString,
  useErrors,
  useSessionCheck,
} from '@pagopa-pn/pn-commons';

import { apiLogout, exchangeToken } from '../redux/auth/actions';
import { resetState } from '../redux/auth/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

const SessionGuard = () => {
  const location = useLocation();
  const [params] = useSearchParams();
  const { sessionToken, desired_exp: expDate } = useAppSelector(
    (state: RootState) => state.userState.user
  );
  const { WORK_IN_PROGRESS, INACTIVITY_HANDLER_MINUTES } = getConfiguration();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { hasSpecificStatusError } = useErrors();
  const { t } = useTranslation(['common']);
  const sessionCheck = useSessionCheck(200, () => sessionCheckCallback());
  const { loading } = useAppSelector((state: RootState) => state.userState);
  const [modalData, setModalData] = useState({
    open: false,
    title: '',
    message: '',
  });

  const hasAnyForbiddenError = hasSpecificStatusError(403);

  const spidToken = new URLSearchParams(location.hash.substring(1)).get('selfCareToken'); // https://github.com/remix-run/history/blob/main/docs/api-reference.md#location.hash

  const performExchangeToken = async (spidToken: string) => {
    AppResponsePublisher.error.subscribe('exchangeToken', manageUnforbiddenError);
    try {
      const aar = localStorage.getItem(AppRouteParams.AAR) || undefined;
      const user = await dispatch(exchangeToken({ spidToken, aar })).unwrap();
      sessionCheck(user.desired_exp);
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

  const manageUnforbiddenError = (e: any) => {
    if (e.status === 451) {
      // error toast must not be shown
      return false;
    }
    return true;
  };

  const exit = async () => {
    if (sessionToken) {
      await dispatch(apiLogout(sessionToken));
    }
    dispatch(resetState());
    goToLoginPortal();
  };

  useEffect(() => {
    const aar = params.get(AppRouteParams.AAR);
    if (aar) {
      localStorage.setItem(AppRouteParams.AAR, sanitizeString(aar));
    }

    if (spidToken) {
      void performExchangeToken(spidToken);
    } else if (sessionToken) {
      sessionCheck(expDate);
    } else {
      goToLoginPortal();
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
