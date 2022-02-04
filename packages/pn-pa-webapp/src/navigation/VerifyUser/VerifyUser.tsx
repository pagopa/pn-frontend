import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { exchangeToken } from '../../redux/auth/actions';
import { RootState } from '../../redux/store';

const VerifyUser = () => {
  const location = useLocation();
  const [selfCareToken, setSelfCareToken] = useState('');
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.userState.user.sessionToken);

  useEffect(() => {
    const params = new URLSearchParams(location.hash);
    const selfCareTokenParam = params.get('#selfCareToken');
    if (selfCareTokenParam) {
      setSelfCareToken(selfCareTokenParam);
    } else {
      if (token === '') {
        /* eslint-disable functional/immutable-data */
        window.location.href = process.env.REACT_APP_URL_SELFCARE_LOGIN || '';
      }
    }
  }, [location]);

  useEffect(() => {
    if (selfCareToken !== '') {
      dispatch(exchangeToken(selfCareToken));
    }
  }, [selfCareToken]);

  return <></>;
};

export default VerifyUser;
