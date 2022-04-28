import { Fragment, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { InactivityHandler, SessionModal } from '@pagopa-pn/pn-commons';

import { logout } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToLogin } from './navigation.utility';

const inactivityTimer = 5 * 60 * 1000;

/**
 * This component returns Outlet if user is logged in.
 * Then all private routes can be accessible
 */
/* eslint-disable functional/immutable-data */
const RequireAuth = () => {
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const [accessDenied, setAccessDenied] = useState(token === '' || !token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token === '' || !token) {
      setAccessDenied(true);
      // Redirect them to the spid-hub login page
      goToLogin();
    }
    if (token && token !== '') {
      setAccessDenied(false);
    }
  }, [token]);

  return (
    <Fragment>
      {accessDenied && (
        <SessionModal
          open
          title={'Stai uscendo da Piattaforma Notifiche'}
          message={'Verrai reindirizzato'}
          handleClose={goToLogin}
        ></SessionModal>
      )}
      <InactivityHandler
        inactivityTimer={inactivityTimer}
        onTimerExpired={() => dispatch(logout())}
      >
        <Outlet />
      </InactivityHandler>
    </Fragment>
  );
};

export default RequireAuth;
