import { AccessDenied } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { URL_FE_LOGIN } from '../utils/constants';

/**
 * This component returns Outlet if user is logged in.
 * Then all private routes can be accessible
 */
/* eslint-disable functional/immutable-data */
const RequireAuth = () => {
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const [accessDenied, setAccessDenied] = useState(true);

  useEffect(() => {
    if (token === '' || !token) {
      // Redirect them to the spid-hub login page
      window.location.href = URL_FE_LOGIN || '';
    }
    if (token && token !== '') {
      setAccessDenied(false);
    }
  }, [token]);

  return accessDenied ? <AccessDenied /> : <Outlet />;
};

export default RequireAuth;
