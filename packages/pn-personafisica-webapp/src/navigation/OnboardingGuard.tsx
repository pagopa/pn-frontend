import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { LoadingPage, NotificationStatus } from '@pagopa-pn/pn-commons';

import { setIsFreshLogin } from '../redux/auth/reducers';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppSelector } from '../redux/hooks';
import { getConfiguration } from '../services/configuration.service';
import { hasRequiredContacts } from '../utility/contacts.utility';
import * as routes from './routes.const';

const OnboardingGuard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { IS_ONBOARDING_ENABLED } = getConfiguration();

  const addresses = useAppSelector(contactsSelectors.selectAddresses);
  const isContactLoading = useAppSelector(contactsSelectors.selectLoading);
  const { loading: isNotificationsLoading, notifications } = useAppSelector(
    (state) => state.dashboardState
  );
  const isFreshLogin = useAppSelector((state) => state.userState.isFreshLogin);

  const isLoading = isContactLoading || isNotificationsLoading;

  const hasNotificationsToRead = useMemo(() => {
    const managedStatusesSet = new Set([
      NotificationStatus.VIEWED,
      NotificationStatus.CANCELLED,
      NotificationStatus.RETURNED_TO_SENDER,
      NotificationStatus.EFFECTIVE_DATE,
    ]);
    return notifications.some((n) => !managedStatusesSet.has(n.notificationStatus));
  }, [notifications]);

  useEffect(() => {
    if (
      location.pathname === '/' &&
      isFreshLogin &&
      !hasRequiredContacts(addresses) &&
      !hasNotificationsToRead &&
      IS_ONBOARDING_ENABLED
    ) {
      navigate(routes.ONBOARDING, { replace: true });
    }
    dispatch(setIsFreshLogin(false));
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return <Outlet />;
};

export default OnboardingGuard;
