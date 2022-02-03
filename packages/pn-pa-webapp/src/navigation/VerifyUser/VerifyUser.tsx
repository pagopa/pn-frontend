import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../redux/auth/actions';
import { RootState } from '../../redux/store';

const VerifyUser = () => {
  const location = useLocation();
  const [selfCareToken, setSelfCareToken] = useState('');
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.userState.token);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.hash);
    const selfCareTokenParam = params.get('#selfCareToken');
    if (selfCareTokenParam) {
      setSelfCareToken(selfCareTokenParam);
    } else {
      /* eslint-disable functional/immutable-data */
      window.location.href = process.env.REACT_APP_URL_SELFCARE_LOGIN || '';
    }
  }, [location]);

  useEffect(() => {
    if (selfCareToken !== '') {
      dispatch(login(selfCareToken));
    }
  }, [selfCareToken]);

  useEffect(() => {
    if (token !== '') {
      navigate('/dashboard');
    }
  }, [token]);

  return <></>;
};

export default VerifyUser;
