import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { exchangeToken } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getHomePage } from '../utils/role.utility';

const VerifyUser = () => {
  const location = useLocation();
  const [selfCareToken, setSelfCareToken] = useState('');
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const navigate = useNavigate();
  const [verificationDone, setVerificationDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.hash);
    const selfCareTokenParam = params.get('#selfCareToken');
    if (selfCareTokenParam) {
      setSelfCareToken(selfCareTokenParam);
    } else {
      setVerificationDone(true);
    }
  }, [location]);

  useEffect(() => {
    if (selfCareToken !== '') {
      void dispatch(exchangeToken(selfCareToken)).then(() => {
        setVerificationDone(true);
      });
    }
  }, [selfCareToken]);

  useEffect(() => {
    if (token !== '' && location.pathname === '/') {
      navigate(getHomePage(), {replace: true});
    }
  }, [token]);

  return verificationDone ? <Outlet /> : <div />;
};

export default VerifyUser;
