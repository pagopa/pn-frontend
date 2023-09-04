import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { LoadingPage } from '@pagopa-pn/pn-commons';

import ToSAcceptancePage from '../pages/ToSAcceptance.page';
import { getPrivacyApproval, getToSApproval } from '../redux/auth/actions';
import { useAppDispatch } from '../redux/hooks';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const ToSGuard = () => {
  const dispatch = useAppDispatch();
  const { tosConsent, privacyConsent, fetchedTos, fetchedPrivacy } = useAppSelector(
    (state: RootState) => state.userState
  );
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);

  const sessionToken = loggedUser.sessionToken;

  useEffect(() => {
    if (sessionToken !== '') {
      void dispatch(getToSApproval());
      void dispatch(getPrivacyApproval());
    }
  }, [sessionToken]);

  if (!fetchedTos || !fetchedPrivacy) {
    return <LoadingPage />;
  }

  if (!tosConsent.accepted || !privacyConsent.accepted) {
    return <ToSAcceptancePage tosConsent={tosConsent} privacyConsent={privacyConsent} />;
  }

  return <Outlet />;
};

export default ToSGuard;
