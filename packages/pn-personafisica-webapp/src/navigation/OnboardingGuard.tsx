import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { LoadingPage, NotificationStatus } from '@pagopa-pn/pn-commons';

import { ChannelType } from '../models/contacts';
import { setIsFreshLogin } from '../redux/auth/reducers';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppSelector } from '../redux/hooks';
import * as routes from './routes.const';

const OnboardingGuard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { legalAddresses, courtesyAddresses } = useAppSelector(contactsSelectors.selectAddresses);
  const isContactLoading = useAppSelector(contactsSelectors.selectLoading);
  const { loading: isNotificationsLoading, notifications } = useAppSelector(
    (state) => state.dashboardState
  );
  const isFreshLogin = useAppSelector((state) => state.userState.isFreshLogin);

  const isLoading = isContactLoading || isNotificationsLoading;

  const hasRequiredContacts = () => {
    const hasLegal = legalAddresses.length > 0;
    const hasEmail = courtesyAddresses.some((addr) => addr.channelType === ChannelType.EMAIL);
    const hasIo = courtesyAddresses.some((addr) => addr.channelType === ChannelType.IOMSG);
    return hasLegal || (hasEmail && hasIo);
  };

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
      !hasRequiredContacts() &&
      !hasNotificationsToRead
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
