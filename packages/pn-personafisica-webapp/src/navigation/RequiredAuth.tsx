import { AccessDenied } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { RootState } from '../redux/store';

/**
 * This component returns Outlet if user is logged in.
 * Then all private routes can be accessible
 */
/* eslint-disable functional/immutable-data */
const RequireAuth = () => {
  const token = useSelector((state: RootState) => state.userState.user.token);
  const [accessDenied, setAccessDenied] = useState(true);

  useEffect(() => {
    if (token === '' || !token) {
      // Redirect them to the selfcare login page
      window.location.href = process.env.REACT_APP_URL_FE_LOGIN || '';
    }
    if (token && token !== '' ) {
      setAccessDenied(false);
    }
  }, [token]);

  return accessDenied ? <AccessDenied /> : <Outlet />;
};

export default RequireAuth;
