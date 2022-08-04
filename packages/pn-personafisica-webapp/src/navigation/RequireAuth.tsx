import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { InactivityHandler, SessionModal, useSessionCheck } from '@pagopa-pn/pn-commons';

import { DISABLE_INACTIVITY_HANDLER } from '../utils/constants';
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
  const expDate = useAppSelector((state: RootState) => state.userState.user.exp);
  const [accessDenied, setAccessDenied] = useState(token === '' || !token);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common']);
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));

  useEffect(() => {
    if (token === '' || !token) {
      setAccessDenied(true);
      // Redirect them to the spid-hub login page
      // goToLogin();
    }
    if (token && token !== '') {
      setAccessDenied(false);
      sessionCheck(expDate);
    }
  }, [token]);

  return (
    <Fragment>
      {accessDenied && (
        <SessionModal
          open
          title={t('leaving-app.title')}
          message={t('leaving-app.message')}
          handleClose={goToLogin}
          initTimeout
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
