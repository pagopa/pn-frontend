import { Suspense } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import {
  AppNotAccessible,
  ConsentType,
  LoadingPage,
  NotFound,
  lazyRetry,
} from '@pagopa-pn/pn-commons';

import TestAutocomplete from '../pages/TestAutocomplete.page';
import { getConfiguration } from '../services/configuration.service';
import RapidAccessGuard from './RapidAccessGuard';
import RouteGuard from './RouteGuard';
import SessionGuard from './SessionGuard';
import ToSGuard from './ToSGuard';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';
import { NOTIFICHE } from './routes.const';

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
const SupportPage = lazyRetry(() => import('../pages/Support.page'));
const DigitalContact = lazyRetry(() => import('../pages/DigitalContact.page'));
const DigitalContactActivation = lazyRetry(
  () => import('../components/Contacts/DigitalContactActivation')
);
const DigitalContactManagement = lazyRetry(
  () => import('../components/Contacts/DigitalContactManagement')
);

const handleAssistanceClick = () => {
  /* eslint-disable-next-line functional/immutable-data */
  window.location.href = getConfiguration().LANDING_SITE_URL;
};

function Router() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<SessionGuard />}>
          {/* protected routes */}
          <Route path="/" element={<RouteGuard />}>
            <Route path="/" element={<ToSGuard />}>
              <Route path="/" element={<RapidAccessGuard />}>
                <Route path={routes.NOTIFICHE} element={<Notifiche />} />
                <Route path={routes.NOTIFICHE_DELEGATO} element={<Notifiche />} />
                <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
                <Route path={routes.DETTAGLIO_NOTIFICA_DELEGATO} element={<NotificationDetail />} />
                <Route path={routes.DELEGHE} element={<Deleghe />} />
                <Route path={routes.NUOVA_DELEGA} element={<NuovaDelega />} />
                <Route path={routes.RECAPITI} element={<Contacts />} />
                <Route path={routes.PROFILO} element={<Profile />} />
                <Route path={routes.APP_STATUS} element={<AppStatus />} />
                <Route path={routes.SUPPORT} element={<SupportPage />} />
                <Route path={routes.DIGITAL_DOMICILE} element={<DigitalContact />}>
                  <Route
                    path={routes.DIGITAL_DOMICILE_ACTIVATION}
                    element={<DigitalContactActivation />}
                  />
                  <Route
                    path={routes.DIGITAL_DOMICILE_MANAGEMENT}
                    element={<DigitalContactManagement />}
                  />
                  <Route element={<Navigate to={routes.RECAPITI} replace />} index />
                </Route>
              </Route>
            </Route>
            {/* not found - non-logged users will see the common AccessDenied component */}
            <Route path="*" element={<RouteGuard />}>
              <Route
                path="*"
                element={
                  <NotFound isLogged goBackAction={() => navigate(NOTIFICHE, { replace: true })} />
                }
              />
            </Route>
          </Route>
        </Route>
        <Route path={routes.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
        <Route path={routes.TERMS_OF_SERVICE} element={<TermsOfServicePage />} />
        <Route
          path={routes.TERMS_OF_SERVICE_SERCQ_SEND}
          element={<TermsOfServicePage type={ConsentType.TOS_SERCQ} />}
        />
        <Route path={routes.PARTICIPATING_ENTITIES} element={<ParticipatingEntitiesPage />} />
        <Route
          path={routes.NOT_ACCESSIBLE}
          element={<AppNotAccessible onAssistanceClick={handleAssistanceClick} />}
        />
        <Route path="test-autocomplete" element={<TestAutocomplete />} />
        {/* not sure that this is useful */}
        <Route path="*" element={<NotFound isLogged={false} goBackAction={goToLoginPortal} />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
