import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { exchangeToken } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getHomePage } from '../utils/role.utility';
import { goToSelfcareLogin } from './navigation.utility';

const VerifyUser = () => {
  const location = useLocation();
  const [selfCareToken, setSelfCareToken] = useState('');
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.hash);
    const selfCareTokenParam = params.get('#selfCareToken');
    if (selfCareTokenParam) {
      setSelfCareToken(selfCareTokenParam);
    } else {
      if (token === '') {
        goToSelfcareLogin();
      }
    }
  }, [location]);

  useEffect(() => {
    if (selfCareToken !== '') {
      dispatch(exchangeToken(selfCareToken))
        .then(() => {
          navigate(getHomePage(), {replace: true});
        })
        .catch(() => {
          goToSelfcareLogin();
        });
    }
  }, [selfCareToken]);

  return <Outlet />;
};

export default VerifyUser;
