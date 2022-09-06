import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HandleAuth, useErrors, useSessionCheck } from '@pagopa-pn/pn-commons';

import { DISABLE_INACTIVITY_HANDLER } from '../utils/constants';
import { AUTH_ACTIONS, logout } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToLogin } from './navigation.utility';

/**
 * This component returns Outlet if user is logged in.
 * Then all private routes can be accessible
 */
/* eslint-disable functional/immutable-data */
const RequireAuth = () => {
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const expDate = useAppSelector((state: RootState) => state.userState.user.exp);
  const isUnauthorizedUser = useAppSelector((state: RootState) => state.userState.isUnauthorizedUser);
  const messageUnauthorizedUser = useAppSelector((state: RootState) => state.userState.messageUnauthorizedUser);
  const [accessDenied, setAccessDenied] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common']);
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));
  const { hasApiErrors } = useErrors();

  const hasTosApiErrors = hasApiErrors(AUTH_ACTIONS.GET_TOS_APPROVAL);


  useEffect(() => {
    if (token === '' || !token || isUnauthorizedUser || hasTosApiErrors) {
      setAccessDenied(true);
    } else {
      setAccessDenied(false);
      sessionCheck(expDate);
    }
  }, [token, hasTosApiErrors ]);

  const goodbyeMessage = {
    title: isUnauthorizedUser ? messageUnauthorizedUser.title : t('leaving-app.title'),
    message: isUnauthorizedUser ? messageUnauthorizedUser.message : t('leaving-app.message'),
  };

  return <HandleAuth
    accessDenied={accessDenied} goodbyeMessage={goodbyeMessage} disableInactivityHandler={DISABLE_INACTIVITY_HANDLER}
    goToLogin={() => goToLogin(window.location.href)} doLogout={() => dispatch(logout())} />;
};

export default RequireAuth;
