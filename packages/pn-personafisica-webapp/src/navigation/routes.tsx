import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppNotAccessible, LoadingPage, NotFound } from '@pagopa-pn/pn-commons';

import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';
import { getConfiguration } from "../services/configuration.service";
import * as routes from './routes.const';
import SessionGuard from './SessionGuard';
import RouteGuard from './RouteGuard';
import ToSGuard from './ToSGuard';
import AARGuard from './AARGuard';

const Profile = React.lazy(() => import('../pages/Profile.page'));
const Notifiche = React.lazy(() => import('../pages/Notifiche.page'));
const NotificationDetail = React.lazy(() => import('../pages/NotificationDetail.page'));
const Contacts = React.lazy(() => import('../pages/Contacts.page'));
const Deleghe = React.lazy(() => import('../pages/Deleghe.page'));
const NuovaDelega = React.lazy(() => import('../pages/NuovaDelega.page'));
const PrivacyPolicyPage = React.lazy(() => import('../pages/PrivacyPolicy.page'));
const TermsOfServicePage = React.lazy(() => import('../pages/TermsOfService.page'));
const AppStatus = React.lazy(() => import('../pages/AppStatus.page'));
const ParticipatingEntitiesPage = React.lazy(() => import('../pages/ParticipatingEntities.page'));

const handleAssistanceClick = () => {
  const { PAGOPA_HELP_EMAIL } = getConfiguration();
  trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO, { source: 'postlogin' });
  /* eslint-disable-next-line functional/immutable-data */
  window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
};

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
                <Route path={routes.NOTIFICHE_DELEGATO} element={<Notifiche />} />
                <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
                <Route path={routes.DETTAGLIO_NOTIFICA_DELEGATO} element={<NotificationDetail />} />
                <Route path={routes.DELEGHE} element={<Deleghe />} />
                <Route path={routes.NUOVA_DELEGA} element={<NuovaDelega />} />
                <Route path={routes.RECAPITI} element={<Contacts />} />
                <Route path={routes.PROFILO} element={<Profile />} />
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
        <Route path={routes.PARTICIPATING_ENTITIES} element={<ParticipatingEntitiesPage />} />
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
