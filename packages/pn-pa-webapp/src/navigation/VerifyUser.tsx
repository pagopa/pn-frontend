import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { exchangeToken } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { SELFCARE_URL_FE_LOGIN } from '../utils/constants';
import { getHomePage } from '../utils/role.utility';

const VerifyUser = () => {
  const location = useLocation();
  const [selfCareToken, setSelfCareToken] = useState('');
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const role = useAppSelector((state: RootState) => state.userState.user.organization?.role);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.hash);
    const selfCareTokenParam = params.get('#selfCareToken');
    if (selfCareTokenParam) {
      setSelfCareToken(selfCareTokenParam);
    } else {
      if (token === '') {
        /* eslint-disable functional/immutable-data */
        window.location.href = SELFCARE_URL_FE_LOGIN || '';
      }
    }
  }, [location]);

  useEffect(() => {
    if (selfCareToken !== '') {
      dispatch(exchangeToken(selfCareToken))
        .then(() => {
          navigate(getHomePage(role))
        })
        .catch(() => {
          /* eslint-disable functional/immutable-data */
          window.location.href = process.env.REACT_APP_URL_SELFCARE_LOGIN || '';
        });
    }
  }, [selfCareToken]);

  return <Outlet />;
};

export default VerifyUser;
