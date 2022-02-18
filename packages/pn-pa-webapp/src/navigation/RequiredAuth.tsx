import { AccessDenied } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { UserRole } from '../models/user';
import { RootState } from '../redux/store';

interface Props {
  roles: Array<UserRole>;
}
/**
 * This component returns Outlet if user is logged in.
 * Then all private routes can be accessible
 */
/* eslint-disable functional/immutable-data */
const RequireAuth = ({ roles }: Props) => {
  const token = useSelector((state: RootState) => state.userState.user.sessionToken);
  const role = useSelector((state: RootState) => state.userState.user.organization?.role);
  const userHasRequiredRole = role && roles.includes(role);
  const [accessDenied, setAccessDenied] = useState(true);

  useEffect(() => {
    if (token === '' || !token) {
      // Redirect them to the selfcare login page
      window.location.href = process.env.REACT_APP_URL_SELFCARE_LOGIN || '';
    }
    if (token && token !== '' && role && userHasRequiredRole) {
      setAccessDenied(false);
    }
  }, [token, role]);

  return accessDenied ? <AccessDenied /> : <Outlet />;
};

export default RequireAuth;
