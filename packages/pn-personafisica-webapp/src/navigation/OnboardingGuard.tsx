import { useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { LoadingPage } from '@pagopa-pn/pn-commons';

import { useRapidAccessParam } from '../hooks/useRapidAccessParam';
import { ChannelType } from '../models/contacts';
import { getDigitalAddresses } from '../redux/contact/actions';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import * as routes from './routes.const';

const OnboardingGuard = () => {
  const dispatch = useAppDispatch();
  const rapidAccess = useRapidAccessParam();
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  const { legalAddresses, courtesyAddresses } = useAppSelector(contactsSelectors.selectAddresses);

  useEffect(() => {
    void dispatch(getDigitalAddresses())
      .unwrap()
      .finally(() => setIsInitialized(true));
  }, [dispatch]);

  const hasRequiredContacts = useMemo(() => {
    const hasLegal = legalAddresses.length > 0;
    const hasEmail = courtesyAddresses.some((addr) => addr.channelType === ChannelType.EMAIL);
    const hasIo = courtesyAddresses.some((addr) => addr.channelType === ChannelType.IOMSG);

    return hasLegal || (hasEmail && hasIo);
  }, [legalAddresses, courtesyAddresses]);

  const isRapidAccess = !!rapidAccess;

  if (!isInitialized) {
    return <LoadingPage />;
  }

  if (!hasRequiredContacts && !isRapidAccess && location.pathname !== routes.ONBOARDING) {
    return <Navigate to={routes.ONBOARDING} replace />;
  }

  if (hasRequiredContacts || isRapidAccess || location.pathname === routes.ONBOARDING) {
    return <Outlet />;
  }

  return <></>;
};

export default OnboardingGuard;
