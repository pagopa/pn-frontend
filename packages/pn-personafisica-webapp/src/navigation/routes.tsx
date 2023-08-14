import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppNotAccessible, LoadingPage, NotFound, lazyRetry } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';
import * as routes from './routes.const';
import SessionGuard from './SessionGuard';
import RouteGuard from './RouteGuard';
import ToSGuard from './ToSGuard';
import AARGuard from './AARGuard';

const Profile = lazyRetry(() => import('../pages/Profile.page'));
const Notifiche = lazyRetry(() => import('../pages/Notifiche.page'));
const NotificationDetail = lazyRetry(() => import('../pages/NotificationDetail.page'));
const Contacts = lazyRetry(() => import('../pages/Contacts.page'));
const Deleghe = lazyRetry(() => import('../pages/Deleghe.page'));
const NuovaDelega = lazyRetry(() => import('../pages/NuovaDelega.page'));
const PrivacyPolicyPage = lazyRetry(() => import('../pages/PrivacyPolicy.page'));
const TermsOfServicePage = lazyRetry(() => import('../pages/TermsOfService.page'));
const AppStatus = lazyRetry(() => import('../pages/AppStatus.page'));
const ParticipatingEntitiesPage = lazyRetry(() => import('../pages/ParticipatingEntities.page'));

const handleAssistanceClick = () => {
  /* eslint-disable-next-line functional/immutable-data */
  window.location.href = getConfiguration().LANDING_SITE_URL;
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
