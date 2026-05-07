import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { LoadingPage, SessionModal } from '@pagopa-pn/pn-commons';

import ToSAcceptancePage from '../pages/ToSAcceptance.page';
import { getTosPrivacyApproval } from '../redux/auth/actions';
import { authSelectors } from '../redux/auth/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToSelfcareLogin } from './navigation.utility';

const ToSGuard = () => {
  const dispatch = useAppDispatch();
  const { tosConsent, privacyConsent, fetchedTos, fetchedPrivacy, tosPrivacyApiError } =
    useAppSelector((state: RootState) => state.userState);
  const isSupportUser = useAppSelector(authSelectors.selectIsSupportUser);
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);
  const { t } = useTranslation(['common']);

  useEffect(() => {
    if (sessionToken && !isSupportUser) {
      void dispatch(getTosPrivacyApproval());
    }
  }, [sessionToken, isSupportUser]);

  if (isSupportUser) {
    return <Outlet />;
  }

  if (tosPrivacyApiError || !fetchedTos || !fetchedPrivacy) {
    return (
      <>
        <LoadingPage />
        <SessionModal
          open={tosPrivacyApiError}
          title={t('error-when-fetching-tos-status.title')}
          message={t('error-when-fetching-tos-status.message')}
          handleClose={() => goToSelfcareLogin()}
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
