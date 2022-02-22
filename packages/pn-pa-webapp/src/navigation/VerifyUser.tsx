import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { exchangeToken } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { SELFCARE_URL_FE_LOGIN } from '../utils/constants';

const VerifyUser = () => {
  const location = useLocation();
  const [selfCareToken, setSelfCareToken] = useState('');
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);

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
      void dispatch(exchangeToken(selfCareToken));
    }
  }, [selfCareToken]);

  return <></>;
};

export default VerifyUser;
