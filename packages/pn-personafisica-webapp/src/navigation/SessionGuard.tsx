import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  LoadingPage,
  SessionModal,
  adaptedTokenExchangeError,
  useSessionCheck,
} from '@pagopa-pn/pn-commons';

import { useRapidAccessParam } from '../hooks/useRapidAccessParam';
import { TokenExchangeRequest } from '../models/User';
import { exchangeToken } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

const SessionGuard = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const rapidAccess = useRapidAccessParam();
  const { sessionToken, exp } = useAppSelector((state: RootState) => state.userState.user);
  const navigate = useNavigate();
  const { WORK_IN_PROGRESS } = getConfiguration();
  const sessionCheck = useSessionCheck(200, () => sessionCheckCallback());
  const { t } = useTranslation(['common']);

  const [modalData, setModalData] = useState({
    open: false,
    title: '',
    message: '',
  });

  const tokenRequest: TokenExchangeRequest | undefined = useMemo(() => {
    const spidToken = new URLSearchParams(location.hash.substring(1)).get('token'); // https://github.com/remix-run/history/blob/main/docs/api-reference.md#location.hash
    return spidToken ? { spidToken, rapidAccess } : undefined;
  }, [location, rapidAccess]);

  useEffect(() => {
    if (sessionToken) {
      sessionCheck(exp);
      return;
    }
    if (tokenRequest) {
      void performExchangeToken(tokenRequest);
    } else {
      goToLoginPortal(rapidAccess);
    }
  }, [sessionToken, tokenRequest]);

  const performExchangeToken = async (token: TokenExchangeRequest) => {
    try {
      await dispatch(exchangeToken(token)).unwrap();

      // Se sono in home "/" redirect a pagina notifiche; rimuovo solo l'hash param "token"
      const pathname = location.pathname === '/' ? routes.NOTIFICHE : location.pathname;
      const hash = new URLSearchParams(location.hash.substring(1));
      hash.delete('token');
      const newHash = hash.toString();

      navigate(
        { pathname, search: location.search, hash: newHash ? `#${newHash}` : '' },
        { replace: true }
      );
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

  return (
    <>
      <SessionModal {...modalData} handleClose={() => goToLoginPortal()} initTimeout />
      {sessionToken ? <Outlet /> : <LoadingPage renderType="whole" />}
    </>
  );
};

export default SessionGuard;
