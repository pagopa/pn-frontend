import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HandleAuth, useSessionCheck } from '@pagopa-pn/pn-commons';

import { DISABLE_INACTIVITY_HANDLER } from '../utils/constants';
import { logout } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { PartyRole } from '../models/user';
import { goToSelfcareLogin } from './navigation.utility';

interface Props {
  roles: Array<PartyRole>;
}

/**
 * This component returns Outlet if user is logged in and has privileges to access some areas.
 * Then all private routes can be accessed
 * 
 * @param roles: List of PartyRole allowed to access some areas
 */
/* eslint-disable functional/immutable-data */
const RequireAuth = ({ roles }: Props) => {
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const role = useAppSelector((state: RootState) => state.userState.user.organization?.roles[0]);
  const expDate = useAppSelector((state: RootState) => state.userState.user.desired_exp);
  const isUnauthorizedUser = useAppSelector((state: RootState) => state.userState.isUnauthorizedUser);
  const messageUnauthorizedUser = useAppSelector((state: RootState) => state.userState.messageUnauthorizedUser);
  const userHasRequiredRole = role && roles.includes(role.partyRole);
  const [accessDenied, setAccessDenied] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common']);
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));

  useEffect(() => {
    if (token === '' || !token || isUnauthorizedUser || !role || !userHasRequiredRole) {
      setAccessDenied(true);
    }
    if (token && token !== '' && role && userHasRequiredRole) {
      setAccessDenied(false);
      sessionCheck(expDate);
    }
  }, [token, role, expDate]);

  const goodbyeMessage = {
    title: isUnauthorizedUser ? messageUnauthorizedUser.title : t('leaving-app.title'),
    message: isUnauthorizedUser ? messageUnauthorizedUser.message : t('leaving-app.message'),
  };

  return <HandleAuth
    accessDenied={accessDenied} goodbyeMessage={goodbyeMessage} disableInactivityHandler={DISABLE_INACTIVITY_HANDLER}
    goToLogin={goToSelfcareLogin} doLogout={() => dispatch(logout())} />;
};

export default RequireAuth;
