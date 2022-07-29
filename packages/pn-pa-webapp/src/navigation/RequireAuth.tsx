import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { InactivityHandler, SessionModal } from '@pagopa-pn/pn-commons';
import { DISABLE_INACTIVITY_HANDLER } from '../utils/constants';

import { logout } from '../redux/auth/actions';
import { useAppDispatch } from '../redux/hooks';
import { RootState } from '../redux/store';
import { PartyRole } from '../models/user';
import { goToSelfcareLogin } from './navigation.utility';

interface Props {
  roles: Array<PartyRole>;
}

const inactivityTimer = 5 * 60 * 1000;

/**
 * This component returns Outlet if user is logged in and has privileges to access some areas.
 * Then all private routes can be accessed
 * 
 * @param roles: List of PartyRole allowed to access some areas
 */
/* eslint-disable functional/immutable-data */
const RequireAuth = ({ roles }: Props) => {
  const token = useSelector((state: RootState) => state.userState.user.sessionToken);
  const role = useSelector((state: RootState) => state.userState.user.organization?.roles[0]);
  const userHasRequiredRole = role && roles.includes(role.partyRole);
  const [accessDenied, setAccessDenied] = useState(token === '' || !token || !userHasRequiredRole);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common']);

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
          title={t('leaving-app.title')}
          message={t('leaving-app.message')}
          handleClose={goToSelfcareLogin}
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
