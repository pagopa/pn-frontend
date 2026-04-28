import { Suspense, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Await,
  Outlet,
  useAsyncValue,
  useLoaderData,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { LoadingPage, NotificationStatus } from '@pagopa-pn/pn-commons';

import { OnboardingSource } from '../models/Onboarding';
import { setIsFreshLogin } from '../redux/auth/reducers';
import { useAppSelector } from '../redux/hooks';
import { setOnboardingSource } from '../redux/sidemenu/reducers';
import { getConfiguration } from '../services/configuration.service';
import { hasRequiredContacts } from '../utility/contacts.utility';
import { OnboardingLoaderData } from './navigation.utility';
import * as routes from './routes.const';

const OnboardingGuardContent = () => {
  const { addresses, notifications } = useAsyncValue() as OnboardingLoaderData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { IS_ONBOARDING_ENABLED } = getConfiguration();
  const isFreshLogin = useAppSelector((state) => state.userState.isFreshLogin);

  const hasNotificationsToRead = useMemo(() => {
    const managedStatusesSet = new Set<NotificationStatus>([
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
      dispatch(setOnboardingSource(OnboardingSource.LOGIN));
      navigate(routes.ONBOARDING, { replace: true });
    }
    dispatch(setIsFreshLogin(false));
  }, []);

  return <Outlet />;
};

const OnboardingGuard = () => {
  const { data } = useLoaderData() as { data: Promise<OnboardingLoaderData> };

  return (
    <Suspense fallback={<LoadingPage />}>
      <Await resolve={data}>
        <OnboardingGuardContent />
      </Await>
    </Suspense>
  );
};

export default OnboardingGuard;
