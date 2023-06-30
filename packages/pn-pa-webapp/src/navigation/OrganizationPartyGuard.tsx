import { ApiErrorWrapper } from '@pagopa-pn/pn-commons';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { AUTH_ACTIONS, getOrganizationParty } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';


/**
 @deprecated since PN-5881
 */
const OrganizationPartyGuard = () => {
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const idOrganization = loggedUser.organization?.id;
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common']);

  const fetchOrganizationParty = useCallback(() => {
    if (idOrganization) {
      void dispatch(getOrganizationParty(idOrganization));
    }
  }, [idOrganization]);

  return (
    <ApiErrorWrapper
      apiId={AUTH_ACTIONS.GET_ORGANIZATION_PARTY}
      reloadAction={() => fetchOrganizationParty()}
      mainText={t('messages.error-in-initial-info-loading')}
      mt={3}
    >
      <Outlet />
    </ApiErrorWrapper>
  );
};

export default OrganizationPartyGuard;
