import { SessionModal } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToLogin } from './navigation.utility';

/**
 * This component returns Outlet if user is logged in.
 * Then all private routes can be accessible
 */
/* eslint-disable functional/immutable-data */
const RequireAuth = () => {
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const [accessDenied, setAccessDenied] = useState(token === '' || !token);

  useEffect(() => {
    if (token === '' || !token) {
      // TODO: far comparire la modale
      setAccessDenied(true);
      // Redirect them to the spid-hub login page
      goToLogin();
    }
    if (token && token !== '') {
      setAccessDenied(false);
    }
  }, [token]);

  return accessDenied ? (
    <SessionModal
      open
      title={'Stai uscendo da Piattaforma Notifiche'}
      message={'Verrai reindirizzato'}
      handleClose={goToLogin}
    ></SessionModal>
  ) : (
    <Outlet />
  );
};

export default RequireAuth;
