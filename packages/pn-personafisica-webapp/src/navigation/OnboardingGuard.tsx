import { useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { LoadingPage, NotificationStatus } from '@pagopa-pn/pn-commons';

import { useRapidAccessParam } from '../hooks/useRapidAccessParam';
import { ChannelType } from '../models/contacts';
import { getDigitalAddresses } from '../redux/contact/actions';
import { contactsSelectors } from '../redux/contact/reducers';
import { getReceivedNotifications } from '../redux/dashboard/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import * as routes from './routes.const';

const OnboardingGuard = () => {
  const dispatch = useAppDispatch();
  const rapidAccess = useRapidAccessParam();
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  const { legalAddresses, courtesyAddresses } = useAppSelector(contactsSelectors.selectAddresses);
  const notifications = useAppSelector((state) => state.dashboardState.notifications);
  const hasSkippedOnboarding = useAppSelector((state) => state.userState.hasSkippedOnboarding);

  useEffect(() => {
    const initData = async () => {
      try {
        await Promise.all([
          dispatch(getDigitalAddresses()).unwrap(),
          dispatch(getReceivedNotifications({ size: 10 })).unwrap(),
        ]);
      } catch (error) {
        console.error('Errore durante il recupero dei dati', error);
      } finally {
        setIsInitialized(true);
      }
    };

    void initData();
  }, [dispatch]);

  const hasRequiredContacts = useMemo(() => {
    const hasLegal = legalAddresses.length > 0;
    const hasEmail = courtesyAddresses.some((addr) => addr.channelType === ChannelType.EMAIL);
    const hasIo = courtesyAddresses.some((addr) => addr.channelType === ChannelType.IOMSG);

    return hasLegal || (hasEmail && hasIo);
  }, [legalAddresses, courtesyAddresses]);

  const hasNotificationsToRead = useMemo(() => {
    const managedStatusesSet = new Set([
      NotificationStatus.VIEWED,
      NotificationStatus.CANCELLED,
      NotificationStatus.RETURNED_TO_SENDER,
      NotificationStatus.EFFECTIVE_DATE,
    ]);
    return notifications.some((n) => !managedStatusesSet.has(n.notificationStatus));
  }, [notifications]);

  const isRapidAccess = !!rapidAccess;

  const goToOnboarding =
    !hasNotificationsToRead && !hasRequiredContacts && !isRapidAccess && !hasSkippedOnboarding;

  if (!isInitialized) {
    return <LoadingPage />;
  }

  if (goToOnboarding && !location.pathname.startsWith(routes.ONBOARDING)) {
    return <Navigate to={routes.ONBOARDING} replace />;
  }

  return <Outlet />;
};

export default OnboardingGuard;
