import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

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

  const { legalAddresses, courtesyAddresses } = useAppSelector(contactsSelectors.selectAddresses);
  const loading = useAppSelector(contactsSelectors.selectLoading);

  useEffect(() => {
    void dispatch(getDigitalAddresses());
  }, []);

  const hasLegalContact: boolean = legalAddresses.length > 0;
  const hasEmail: boolean = courtesyAddresses.some(
    (addr) => addr.channelType === ChannelType.EMAIL
  );
  const hasIo: boolean = courtesyAddresses.some((addr) => addr.channelType === ChannelType.IOMSG);

  const hasRequiredContacts = (hasEmail && hasIo) || hasLegalContact;
  const isRapidAccess = !!rapidAccess;

  if (loading) {
    return <LoadingPage />;
  }

  if (!hasRequiredContacts && !isRapidAccess) {
    return <Navigate to={routes.ONBOARDING} replace />;
  }

  return <Outlet />;
};

export default OnboardingGuard;
