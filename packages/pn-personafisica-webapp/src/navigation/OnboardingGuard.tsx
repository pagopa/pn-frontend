import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import type { Notification } from '@pagopa-pn/pn-commons';
import { LoadingPage, NotificationStatus } from '@pagopa-pn/pn-commons';

import { OnboardingSource } from '../models/Onboarding';
import { setIsFreshLogin } from '../redux/auth/reducers';
import { getDigitalAddresses } from '../redux/contact/actions';
import { contactsSelectors } from '../redux/contact/reducers';
import { getReceivedNotifications } from '../redux/dashboard/actions';
import { setFirstSearch } from '../redux/dashboard/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setOnboardingSource } from '../redux/sidemenu/reducers';
import { getConfiguration } from '../services/configuration.service';
import { hasRequiredContacts } from '../utility/contacts.utility';
import * as routes from './routes.const';

const hasNotificationsToRead = (notifications: Array<Notification>): boolean => {
  const managedStatuses = new Set([
    NotificationStatus.VIEWED,
    NotificationStatus.CANCELLED,
    NotificationStatus.RETURNED_TO_SENDER,
    NotificationStatus.EFFECTIVE_DATE,
  ]);
  return notifications.some((n) => !managedStatuses.has(n.notificationStatus));
};

const OnboardingGuard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { IS_ONBOARDING_ENABLED } = getConfiguration();
  const addresses = useAppSelector(contactsSelectors.selectAddresses);
  const isFreshLogin = useAppSelector((state) => state.userState.isFreshLogin);

  const [isLoading, setIsLoading] = useState(true);

  const fetchOnboardingData = async () => {
    await dispatch(getDigitalAddresses()).unwrap();
    const notifications = await dispatch(getReceivedNotifications({ size: 10 })).unwrap();
    dispatch(setFirstSearch(true));
    return notifications.resultsPage;
  };

  useEffect(() => {
    fetchOnboardingData()
      .then((notifications) => {
        console.log('NOTIFICATIONS TO READ? ', hasNotificationsToRead(notifications));

        const shouldRedirectToOnboarding =
          location.pathname === '/' &&
          isFreshLogin &&
          !hasRequiredContacts(addresses) &&
          !hasNotificationsToRead(notifications) &&
          IS_ONBOARDING_ENABLED;

        if (shouldRedirectToOnboarding) {
          dispatch(setOnboardingSource(OnboardingSource.LOGIN));
          navigate(routes.ONBOARDING, { replace: true });
        }
      })
      .catch((error) => {
        console.error('OnboardingGuard - Failed to fetch onboarding data', error);
      })
      .finally(() => {
        dispatch(setIsFreshLogin(false));
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return <Outlet />;
};

export default OnboardingGuard;
