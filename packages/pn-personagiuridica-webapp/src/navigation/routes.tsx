import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingPage, NotFound } from '@pagopa-pn/pn-commons';

import * as routes from './routes.const';
import SessionGuard from './SessionGuard';
import RouteGuard from './RouteGuard';
import ToSGuard from './ToSGuard';
import AARGuard from './AARGuard';

const AppStatus = React.lazy(() => import('../pages/AppStatus.page'));
const Contacts = React.lazy(() => import('../pages/Contacts.page'));
// const Deleghe = React.lazy(() => import('../pages/Deleghe.page'));
const NotificationDetail = React.lazy(() => import('../pages/NotificationDetail.page'));
const Notifiche = React.lazy(() => import('../pages/Notifiche.page'));
const PrivacyPolicyPage = React.lazy(() => import('../pages/PrivacyPolicy.page'));
const TermsOfServicePage = React.lazy(() => import('../pages/TermsOfService.page'));
const UnderConstruction = React.lazy(() => import('../pages/UnderConstruction.page'));

function Router() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<SessionGuard />}>
          {/* protected routes */}
          <Route path="/" element={<RouteGuard />}>
            <Route path="/" element={<ToSGuard />}>
              <Route path="/" element={<AARGuard />}>
                <Route path={routes.NOTIFICHE} element={<Notifiche />} />
                <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
                <Route path={routes.RECAPITI} element={<Contacts />} />
                <Route path={routes.APP_STATUS} element={<AppStatus />} />
                <Route path={routes.USERS} element={<UnderConstruction />} />
                <Route path={routes.GROUPS} element={<UnderConstruction />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
