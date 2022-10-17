import { Routes, Route } from 'react-router-dom';
import { NotFound } from '@pagopa-pn/pn-commons';

import Dashboard from '../pages/Dashboard.page';
import NotificationDetail from '../pages/NotificationDetail.page';
import NewNotification from '../pages/NewNotification.page';
import Statistics from "../pages/Statistics.page";
// import ApiKeys from '../pages/ApiKeys.page';
import PrivacyTOSPage from "../pages/PrivacyTOS.page";

import { PNRole } from '../models/user';
import TermsOfService from '../pages/TermsOfService.page';
import * as routes from './routes.const';
import SessionGuard from './SessionGuard';
import RouteGuard from './RouteGuard';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<SessionGuard />}>
        {/* protected routes */}
        <Route path={routes.STATISTICHE} element={<RouteGuard roles={[PNRole.ADMIN]} />}>
          <Route path={routes.STATISTICHE} element={<Statistics/>} />
        </Route>
        <Route path="/"  element={<RouteGuard roles={[PNRole.ADMIN, PNRole.OPERATOR]} />}>
          <Route path={routes.TOS} element={<TermsOfService />} />
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
        {/* not found - non-logged users will see the common AccessDenied component */}
        <Route path="*" element={<RouteGuard roles={null} />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path={routes.PRIVACY_TOS} element={<PrivacyTOSPage />} />
    </Routes>
  );
}

export default Router;
