import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppNotAccessible, LoadingPage, NotFound, PrivateRoute } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../redux/hooks';
import { PNRole } from '../redux/auth/types';
import { rolesAndHasGroup } from '../redux/auth/reducers';
import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';
import { getConfiguration } from '../services/configuration.service';
import * as routes from './routes.const';
import SessionGuard from './SessionGuard';
import RouteGuard from './RouteGuard';
import ToSGuard from './ToSGuard';
import AARGuard from './AARGuard';

const AppStatus = React.lazy(() => import('../pages/AppStatus.page'));
const Contacts = React.lazy(() => import('../pages/Contacts.page'));
const Deleghe = React.lazy(() => import('../pages/Deleghe.page'));
const NuovaDelega = React.lazy(() => import('../pages/NuovaDelega.page'));
const NotificationDetail = React.lazy(() => import('../pages/NotificationDetail.page'));
const Notifiche = React.lazy(() => import('../pages/Notifiche.page'));
const PrivacyPolicyPage = React.lazy(() => import('../pages/PrivacyPolicy.page'));
const TermsOfServicePage = React.lazy(() => import('../pages/TermsOfService.page'));

const handleAssistanceClick = () => {
  const { PAGOPA_HELP_EMAIL } = getConfiguration();
  trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO, { source: 'postlogin' });
  /* eslint-disable-next-line functional/immutable-data */
  window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
};

function Router() {
  const { hasGroup: userHasGroup, roles } = useAppSelector(rolesAndHasGroup);
  const currentRoles = roles.map((role) => role.role);

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<SessionGuard />}>
          {/* protected routes */}
          <Route path="/" element={<RouteGuard />}>
            <Route path="/" element={<ToSGuard />}>
              <Route path="/" element={<AARGuard />}>
                <Route
                  path={routes.NOTIFICHE}
                  element={
                    <PrivateRoute
                      currentRoles={[]}
                      requiredRoles={[]}
                      additionalCondition={!userHasGroup}
                      redirectTo={<NotFound />}
                    >
                      <Notifiche />
                    </PrivateRoute>
                  }
                />
                <Route path={routes.NOTIFICHE_DELEGATO} element={<Notifiche isDelegatedPage />} />
                <Route
                  path={routes.DETTAGLIO_NOTIFICA}
                  element={
                    <PrivateRoute
                      currentRoles={[]}
                      requiredRoles={[]}
                      additionalCondition={!userHasGroup}
                      redirectTo={<NotFound />}
                    >
                      <NotificationDetail />
                    </PrivateRoute>
                  }
                />
                <Route path={routes.DETTAGLIO_NOTIFICA_DELEGATO} element={<NotificationDetail />} />
                <Route
                  path={routes.DELEGHE}
                  element={
                    <PrivateRoute
                      currentRoles={currentRoles}
                      requiredRoles={[PNRole.ADMIN]}
                      redirectTo={<NotFound />}
                    >
                      <Deleghe />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={routes.NUOVA_DELEGA}
                  element={
                    <PrivateRoute
                      currentRoles={currentRoles}
                      requiredRoles={[PNRole.ADMIN]}
                      redirectTo={<NotFound />}
                      additionalCondition={!userHasGroup}
                    >
                      <NuovaDelega />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={routes.RECAPITI}
                  element={
                    <PrivateRoute
                      currentRoles={currentRoles}
                      requiredRoles={[PNRole.ADMIN]}
                      additionalCondition={!userHasGroup}
                      redirectTo={<NotFound />}
                    >
                      <Contacts />
                    </PrivateRoute>
                  }
                />
                <Route path={routes.APP_STATUS} element={<AppStatus />} />
              </Route>
            </Route>
            {/* not found - non-logged users will see the common AccessDenied component */}
            <Route path="*" element={<RouteGuard />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Route>
        <Route path={routes.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
        <Route path={routes.TERMS_OF_SERVICE} element={<TermsOfServicePage />} />
        <Route
          path={routes.NOT_ACCESSIBLE}
          element={<AppNotAccessible onAssistanceClick={handleAssistanceClick} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
