import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { LoadingPage, SessionModal, adaptedTokenExchangeError } from '@pagopa-pn/pn-commons';

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
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);
  const navigate = useNavigate();
  const { WORK_IN_PROGRESS } = getConfiguration();

  const [modalData, setModalData] = useState({
    open: false,
    title: '',
    message: '',
  });

  const tokenRequest: TokenExchangeRequest | undefined = useMemo(() => {
    const spidToken = new URLSearchParams(location.hash).get('#token');
    return spidToken ? { spidToken, rapidAccess } : undefined;
  }, [location, rapidAccess]);

  useEffect(() => {
    if (sessionToken) {
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

      // rimuovo l'hash param (#token) dalla URL se non sono nella home (nella home c'è già un redirect)
      if (location.pathname !== '/') {
        window.history.replaceState(null, '', location.pathname + location.search);
      }
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

  return (
    <>
      <SessionModal {...modalData} handleClose={() => goToLoginPortal()} initTimeout />
      {sessionToken ? <Outlet /> : <LoadingPage renderType="whole" />}
    </>
  );
};

export default SessionGuard;