import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { InactivityHandler, SessionModal } from '@pagopa-pn/pn-commons';

import { logout } from '../redux/auth/actions';
import { useAppDispatch } from '../redux/hooks';
import { RootState } from '../redux/store';
import { UserRole } from '../models/user';
import { goToSelfcareLogin } from './navigation.utility';

interface Props {
  roles: Array<UserRole>;
}

const inactivityTimer = 5 * 60 * 1000;

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
  const dispatch = useAppDispatch();

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

  return (
    <Fragment>
      {accessDenied && (
        <SessionModal
          open
          title={'Stai uscendo da Piattaforma Notifiche'}
          message={'Verrai reindirizzato'}
          handleClose={goToSelfcareLogin}
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
