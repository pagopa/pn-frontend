import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { LoadingPage, SessionModal } from '@pagopa-pn/pn-commons';

import ToSAcceptancePage from '../pages/ToSAcceptance.page';
import { getTosPrivacyApproval } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToLoginPortal } from './navigation.utility';

const ToSGuard = () => {
  const dispatch = useAppDispatch();
  const { tosConsent, privacyConsent, fetchedTos, fetchedPrivacy, tosPrivacyApiError } =
    useAppSelector((state: RootState) => state.userState);
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);
  const { t } = useTranslation(['common']);

  useEffect(() => {
    if (sessionToken) {
      void dispatch(getTosPrivacyApproval());
    }
  }, [sessionToken]);

  if (tosPrivacyApiError || !fetchedTos || !fetchedPrivacy) {
    return (
      <>
        <LoadingPage />
        <SessionModal
          open={tosPrivacyApiError}
          title={t('error-when-fetching-tos-status.title')}
          message={t('error-when-fetching-tos-status.message')}
          handleClose={() => goToLoginPortal()}
          initTimeout
        />
      </>
    );
  }

  if (!tosConsent.accepted || !privacyConsent.accepted) {
    return <ToSAcceptancePage tosConsent={tosConsent} privacyConsent={privacyConsent} />;
  }

  return <Outlet />;
};

export default ToSGuard;
