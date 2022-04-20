import { SessionModal } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { UserRole } from '../models/user';
import { RootState } from '../redux/store';
import { goToSelfcareLogin } from './navigation.utility';

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
  const [accessDenied, setAccessDenied] = useState(token === '' || !token || !userHasRequiredRole);

  useEffect(() => {
    if (token === '' || !token) {
      setAccessDenied(true);
      // Redirect them to the selfcare login page
      goToSelfcareLogin();
    }
    if (token && token !== '' && role && userHasRequiredRole) {
      setAccessDenied(false);
    }
  }, [token, role]);

  return accessDenied ? (
    <SessionModal
      open
      title={'Stai uscendo da Piattaforma Notifiche'}
      message={'Verrai reindirizzato'}
      handleClose={goToSelfcareLogin}
    ></SessionModal>
  ) : (
    <Outlet />
  );
};

export default RequireAuth;
