import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

import { NotificationStatus } from '@pagopa-pn/pn-commons';

import { OnboardingSource } from '../models/Onboarding';
import { setIsFreshLogin } from '../redux/auth/reducers';
import { useAppSelector } from '../redux/hooks';
import { setOnboardingSource } from '../redux/sidemenu/reducers';
import { getConfiguration } from '../services/configuration.service';
import { hasRequiredContacts } from '../utility/contacts.utility';
import * as routes from './routes.const';

type LoaderData = {
  addresses: any;
  notifications: any;
};

const OnboardingGuard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { IS_ONBOARDING_ENABLED } = getConfiguration();
  const { addresses, notifications } = useLoaderData() as LoaderData;

  console.log('OnboardingGuard - addresses:', addresses);
  console.log('OnboardingGuard - notifications:', notifications);
  const isFreshLogin = useAppSelector((state) => state.userState.isFreshLogin);

  const hasNotificationsToRead = useMemo(() => {
    const managedStatusesSet = new Set([
      NotificationStatus.VIEWED,
      NotificationStatus.CANCELLED,
      NotificationStatus.RETURNED_TO_SENDER,
      NotificationStatus.EFFECTIVE_DATE,
    ]);
    return notifications.some((n: any) => !managedStatusesSet.has(n.notificationStatus));
  }, [notifications]);

  useEffect(() => {
    if (
      location.pathname === '/' &&
      isFreshLogin &&
      !hasRequiredContacts(addresses) &&
      !hasNotificationsToRead &&
      IS_ONBOARDING_ENABLED
    ) {
      dispatch(setOnboardingSource(OnboardingSource.LOGIN));
      navigate(routes.ONBOARDING, { replace: true });
    }
    dispatch(setIsFreshLogin(false));
  }, []);

  return <Outlet />;
};

export default OnboardingGuard;
