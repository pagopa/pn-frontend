import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { exchangeToken } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToLogin } from './navigation.utility';
import * as routes from './routes.const';

const VerifyUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [spidToken, setSpidToken] = useState('');
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const { tos, fetchedTos } = useAppSelector((state: RootState) => state.userState);

  useEffect(() => {
    const params = new URLSearchParams(location.hash);
    const tokenParam = params.get('#token');
    if (tokenParam) {
      setSpidToken(tokenParam);
    } else {
      if (token === '') {
        goToLogin(window.location.href);
      }
    }
  }, [location, token]);

  useEffect(() => {
    if (spidToken !== '') {
      dispatch(exchangeToken(spidToken)).catch(() => {
        goToLogin();
      });
    }
  }, [spidToken]);

  useEffect(() => {
    if (token !== '' && fetchedTos && !tos) {
      navigate(routes.TOS, {replace: true});
    }
    if (token !== '' && fetchedTos && tos && location.pathname === '/') {
      navigate(routes.NOTIFICHE, {replace: true});
    }
  }, [fetchedTos, tos]);

  return <Outlet />;
};

export default VerifyUser;
