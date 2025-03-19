import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { AppNotAccessible, NotFound } from '@pagopa-pn/pn-commons';

// import Statistics from '../pages/Statistics.page';
import { PNRole } from '../models/user';
import ApiKeys from '../pages/ApiKeys.page';
import AppStatus from '../pages/AppStatus.page';
import Dashboard from '../pages/Dashboard.page';
import NewApiKey from '../pages/NewApiKey.page';
import NewNotification from '../pages/NewNotification.page';
import NotificationDetail from '../pages/NotificationDetail.page';
import PrivacyPolicyPage from '../pages/PrivacyPolicy.page';
import Statistics from '../pages/Statistics.page';
import TermsOfServicePage from '../pages/TermsOfService.page';
import { getConfiguration } from '../services/configuration.service';
import RouteGuard from './RouteGuard';
import SessionGuard from './SessionGuard';
import ToSGuard from './ToSGuard';
import * as routes from './routes.const';

const handleAssistanceClick = () => {
  /* eslint-disable-next-line functional/immutable-data */
  window.location.href = getConfiguration().LANDING_SITE_URL;
};

function Router() {
  const { IS_STATISTICS_ENABLED } = getConfiguration();
  const navigate = useNavigate();

  const navigateToHome = () => navigate(routes.DASHBOARD, { replace: true });

  return (
    <Routes>
      <Route path="/" element={<SessionGuard />}>
        {/* protected routes */}
        <Route path="/" element={<RouteGuard roles={[PNRole.ADMIN, PNRole.OPERATOR]} />}>
          <Route path="/" element={<ToSGuard />}>
            <Route path={routes.DASHBOARD} element={<Dashboard />} />
            {IS_STATISTICS_ENABLED && <Route path={routes.STATISTICHE} element={<Statistics />} />}
            <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
            {getConfiguration().IS_MANUAL_SEND_ENABLED && (
              <Route path={routes.NUOVA_NOTIFICA} element={<NewNotification />} />
            )}
            <Route path={routes.APP_STATUS} element={<AppStatus />} />
            {/**
             * Refers to PN-1741
             * Commented out because beyond MVP scope
             *
             * LINKED TO:
             * - "const BasicMenuItems" in packages/pn-pa-webapp/src/utility/role.utility.ts
             * - BasicMenuItems in packages/pn-pa-webapp/src/utility/__TEST__/role.utilitytest.ts
             *
             * <Route path={routes.API_KEYS} element={<ApiKeys />} />
             * */}
            <Route path={routes.API_KEYS} element={<ApiKeys />} />
            <Route path={routes.NUOVA_API_KEY} element={<NewApiKey />} />
            <Route path="/" element={<Navigate to={routes.DASHBOARD} />} />
          </Route>
          {/* not found - non-logged users will see the common AccessDenied component */}
          <Route path="*" element={<RouteGuard roles={null} />}>
            <Route path="*" element={<NotFound goBackAction={navigateToHome} />} />
          </Route>
        </Route>
      </Route>
      <Route path={routes.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
      <Route path={routes.TERMS_OF_SERVICE} element={<TermsOfServicePage />} />
      <Route
        path={routes.NOT_ACCESSIBLE}
        element={<AppNotAccessible onAssistanceClick={handleAssistanceClick} />}
      />
      <Route path="*" element={<NotFound goBackAction={navigateToHome} />} />
    </Routes>
  );
}

export default Router;
