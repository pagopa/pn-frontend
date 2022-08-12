import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { exchangeToken } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
// import { goToLogin } from './navigation.utility';
import * as routes from './routes.const';

function isUnauthorizedUser(e: any) {
  return e.type?.endsWith('rejected') && (e.payload?.isUnauthorizedUser);
}

function solveExchangeToken(spidToken: string, callExchangeToken: any, setVerificationDone: any) {
  if (spidToken !== '') {
    callExchangeToken(spidToken).then((e: any) => {
      console.log('coming back from exchangeToken, this is the result');
      console.log(e);
      console.log(isUnauthorizedUser(e));
      if (!isUnauthorizedUser(e)) { setVerificationDone(true); } 
    });
  }
}

const VerifyUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [spidToken, setSpidToken] = useState('');
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const { tos, fetchedTos } = useAppSelector((state: RootState) => state.userState);
  const [verificationDone, setVerificationDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.hash);
    const tokenParam = params.get('#token');
    if (tokenParam) {
      setSpidToken(tokenParam);
    } else {
      setVerificationDone(true);
    }
  }, [location, token]);

  useEffect(() => {
    solveExchangeToken(spidToken, (token: string) => dispatch(exchangeToken(token)), setVerificationDone);
    // if (spidToken !== '') {
    //   dispatch(exchangeToken(spidToken)).then((e) => {
    //     if (!isUnauthorizedUser(e)) { setVerificationDone(true); } 
    //   }).catch(() => {
    //     goToLogin();
    //   });
    // }
  }, [spidToken]);

  useEffect(() => {
    if (token !== '' && fetchedTos && !tos) {
      navigate(routes.TOS, {replace: true});
    }
    if (token !== '' && fetchedTos && tos && location.pathname === '/') {
      navigate(routes.NOTIFICHE, {replace: true});
    }
  }, [fetchedTos, tos]);

  return verificationDone ? <Outlet /> : <div />;
};

export default VerifyUser;
