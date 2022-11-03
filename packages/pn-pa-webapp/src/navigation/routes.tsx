import { useCallback } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApiErrorWrapper, NotFound } from '@pagopa-pn/pn-commons';

import Dashboard from '../pages/Dashboard.page';
import NotificationDetail from '../pages/NotificationDetail.page';
import NewNotification from '../pages/NewNotification.page';
// import ApiKeys from '../pages/ApiKeys.page';
import PrivacyPolicyPage from "../pages/PrivacyPolicy.page";
import TermsOfServicePage from "../pages/TermsOfService.page";

import { PNRole } from '../models/user';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { AUTH_ACTIONS, getOrganizationParty } from '../redux/auth/actions';
import ToSAcceptance from '../pages/ToSAcceptance.page';
import * as routes from './routes.const';
import SessionGuard from './SessionGuard';
import RouteGuard from './RouteGuard';

function OrganizationPartyGuard() {
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
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<SessionGuard />}>
        <Route path="/" element={<OrganizationPartyGuard />}>
          {/* protected routes */}
          <Route path="/"  element={<RouteGuard roles={[PNRole.ADMIN, PNRole.OPERATOR]} />}>
            <Route path={routes.TOS} element={<ToSAcceptance />} />
            <Route path={routes.DASHBOARD} element={<Dashboard />} />
            <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
            <Route path={routes.NUOVA_NOTIFICA} element={<NewNotification />} />
            {/**
             * Refers to PN-1741
             * Commented out because beyond MVP scope
             *
             * LINKED TO:
             * - "const BasicMenuItems" in packages/pn-pa-webapp/src/utils/role.utility.ts
             * - BasicMenuItems in packages/pn-pa-webapp/src/utils/__TEST__/role.utilitytest.ts
             *
             * <Route path={routes.API_KEYS} element={<ApiKeys />} />
             * */}
          </Route>
        </Route>
        {/* not found - non-logged users will see the common AccessDenied component */}
        <Route path="*" element={<RouteGuard roles={null} />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
      <Route path={routes.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
      <Route path={routes.TERMS_OF_SERVICE} element={<TermsOfServicePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
