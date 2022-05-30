import { Fragment, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { InactivityHandler, SessionModal } from '@pagopa-pn/pn-commons';

import { DISABLE_INACTIVITY_HANDLER } from '../utils/constants';
import { logout } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToLogin } from './navigation.utility';
import * as routes from './routes.const';

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
  const navigate = useNavigate();
  const { tos, fetchedTos } = useAppSelector((state: RootState) => state.userState);

  useEffect(() => {
    if (token !== '' && fetchedTos && !tos) {
      navigate(routes.TOS);
    }
  }, [fetchedTos, tos]);

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
        />
      )}
      {DISABLE_INACTIVITY_HANDLER ? (
        <Outlet />
      ) : (
        <InactivityHandler
          inactivityTimer={inactivityTimer}
          onTimerExpired={() => dispatch(logout())}
        >
          <Outlet />
        </InactivityHandler>
      )}
    </Fragment>
  );
};

export default RequireAuth;
