import { NotFound } from '@pagopa-pn/pn-commons';
import { Route, Routes } from 'react-router-dom';

import Dashboard from '../pages/Dashboard.page';
import NewNotification from '../pages/NewNotification.page';
import NotificationDetail from '../pages/NotificationDetail.page';
// import ApiKeys from '../pages/ApiKeys.page';
import PrivacyPolicyPage from "../pages/PrivacyPolicy.page";
import TermsOfServicePage from "../pages/TermsOfService.page";

import { PNRole } from '../models/user';
import AppStatus from '../pages/AppStatus.page';
import ToSAcceptance from '../pages/ToSAcceptance.page';
import RouteGuard from './RouteGuard';
import * as routes from './routes.const';
import SessionGuard from './SessionGuard';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<SessionGuard />}>
        {/* protected routes */}
        <Route path="/"  element={<RouteGuard roles={[PNRole.ADMIN, PNRole.OPERATOR]} />}>
          <Route path={routes.TOS} element={<ToSAcceptance />} />
          <Route path={routes.DASHBOARD} element={<Dashboard />} />
          <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
          <Route path={routes.NUOVA_NOTIFICA} element={<NewNotification />} />
          <Route path={routes.APP_STATUS} element={<AppStatus />} />
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
