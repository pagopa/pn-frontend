import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  AppNotAccessible,
  LoadingPage,
  NotFound,
  PrivateRoute,
  lazyRetry,
} from '@pagopa-pn/pn-commons';

import DelegatesByCompany from '../components/Deleghe/DelegatesByCompany';
import DelegationsOfTheCompany from '../components/Deleghe/DelegationsOfTheCompany';
import { PNRole } from '../redux/auth/types';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import AARGuard from './AARGuard';
import RouteGuard from './RouteGuard';
import SessionGuard from './SessionGuard';
import ToSGuard from './ToSGuard';
import * as routes from './routes.const';

const AppStatus = lazyRetry(() => import('../pages/AppStatus.page'));
const Contacts = lazyRetry(() => import('../pages/Contacts.page'));
const Deleghe = lazyRetry(() => import('../pages/Deleghe.page'));
const NuovaDelega = lazyRetry(() => import('../pages/NuovaDelega.page'));
const NotificationDetail = lazyRetry(() => import('../pages/NotificationDetail.page'));
const Notifiche = lazyRetry(() => import('../pages/Notifiche.page'));
const PrivacyPolicyPage = lazyRetry(() => import('../pages/PrivacyPolicy.page'));
const TermsOfServicePage = lazyRetry(() => import('../pages/TermsOfService.page'));

const handleAssistanceClick = () => {
  /* eslint-disable-next-line functional/immutable-data */
  window.location.href = getConfiguration().LANDING_SITE_URL;
};

function Router() {
  const { organization, hasGroup } = useAppSelector((state: RootState) => state.userState.user);
  const currentRoles = organization?.roles ? organization.roles.map((role) => role.role) : [];
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
                      additionalCondition={!hasGroup}
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
                      additionalCondition={!hasGroup}
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
                >
                  <Route path={routes.DELEGHEACARICO} element={<DelegationsOfTheCompany />} />
                  <Route
                    path={routes.DELEGATI}
                    element={
                      <PrivateRoute
                        currentRoles={[]}
                        requiredRoles={[]}
                        additionalCondition={!hasGroup}
                        redirectTo={<NotFound />}
                      >
                        <DelegatesByCompany />
                      </PrivateRoute>
                    }
                  />
                  <Route path="" element={<Navigate to={routes.DELEGHEACARICO} />} />
                </Route>

                <Route
                  path={routes.NUOVA_DELEGA}
                  element={
                    <PrivateRoute
                      currentRoles={currentRoles}
                      requiredRoles={[PNRole.ADMIN]}
                      redirectTo={<NotFound />}
                      additionalCondition={!hasGroup}
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
                      additionalCondition={!hasGroup}
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
