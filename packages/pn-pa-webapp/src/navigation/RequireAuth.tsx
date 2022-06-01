import { Fragment, useEffect, useState } from 'react';
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
 * This component returns Outlet if user is logged in.
 * Then all private routes can be accessible
 */
/* eslint-disable functional/immutable-data */
const RequireAuth = ({ roles }: Props) => {
  const token = useSelector((state: RootState) => state.userState.user.sessionToken);
  const role = useSelector((state: RootState) => state.userState.user.organization?.roles[0]);
  const userHasRequiredRole = role && roles.includes(role.partyRole);
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
          message={'Non hai i provilegi per accedere a questa sezione'}
          handleClose={goToSelfcareLogin}
        ></SessionModal>
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
