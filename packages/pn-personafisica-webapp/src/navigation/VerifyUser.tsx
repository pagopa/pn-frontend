import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { exchangeToken } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import * as routes from './routes.const';


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
      console.log('VerifyUser - no token found');
      setVerificationDone(true);
    }
  }, [location]);

  useEffect(() => {
    if (spidToken !== '') {
      void dispatch(exchangeToken(spidToken)).then(() => {
        setVerificationDone(true);
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
  }, [token, fetchedTos, tos]);

  return verificationDone ? <Outlet /> : <div />;
};

export default VerifyUser;
