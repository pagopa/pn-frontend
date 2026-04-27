import { Suspense, useMemo } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ConsentType, LoadingPage, NotFound, lazyRetry } from '@pagopa-pn/pn-commons';
import ErrorBoundary from '@pagopa-pn/pn-commons/src/components/ErrorBoundary';

import App from '../App';
import OnboardingCourtesyWizard from '../components/Contacts/Onboarding/Courtesy/OnboardingCourtesyWizard';
import DigitalDomicileWizard from '../components/Contacts/Onboarding/DigitalDomicileWizard';
import IoActivationWizard from '../components/Contacts/Onboarding/IoActivationWizard';
import OnboardingHome from '../components/Contacts/Onboarding/OnboardingHome';
import TppLanding from '../pages/TppLanding.page';
import { getConfiguration } from '../services/configuration.service';
import AppNotAccessibleRoute from './AppNotAccessibleRoute';
import OnboardingGuard from './OnboardingGuard';
import RapidAccessGuard from './RapidAccessGuard';
import SessionGuard from './SessionGuard';
import ToSGuard from './ToSGuard';
import { onboardingLoader } from './navigation.utility';
import * as routes from './routes.const';

const Profile = lazyRetry(() => import('../pages/Profile.page'));
const Notifiche = lazyRetry(() => import('../pages/Notifiche.page'));
const NotificationDetail = lazyRetry(() => import('../pages/NotificationDetail.page'));
const Contacts = lazyRetry(() => import('../pages/Contacts.page'));
const Deleghe = lazyRetry(() => import('../pages/Deleghe.page'));
const NuovaDelega = lazyRetry(() => import('../pages/NuovaDelega.page'));
const PrivacyPolicyPage = lazyRetry(() => import('../pages/PrivacyPolicy.page'));
const TermsOfServicePage = lazyRetry(() => import('../pages/TermsOfService.page'));
const AppStatus = lazyRetry(() => import('../pages/AppStatus.page'));
const Onboarding = lazyRetry(() => import('../pages/Onboarding.page'));
const ParticipatingEntitiesPage = lazyRetry(() => import('../pages/ParticipatingEntities.page'));
const SupportPage = lazyRetry(() => import('../pages/Support.page'));
const DigitalContact = lazyRetry(() => import('../pages/DigitalContact.page'));
const DigitalContactActivation = lazyRetry(
  () => import('../components/Contacts/DigitalContactActivation')
);
const DigitalContactManagement = lazyRetry(
  () => import('../components/Contacts/DigitalContactManagement')
);

const Router: React.FC = () => {
  const { IS_ONBOARDING_ENABLED } = getConfiguration();

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: <App />,
          errorElement: <ErrorBoundary />,
          children: [
            {
              element: <SessionGuard />,
              children: [
                {
                  element: <ToSGuard />,
                  children: [
                    {
                      element: <RapidAccessGuard />,
                      children: [
                        {
                          element: <OnboardingGuard />,
                          loader: onboardingLoader,
                          children: [
                            {
                              index: true,
                              element: <Navigate to={routes.NOTIFICHE} replace />,
                            },
                            {
                              path: routes.NOTIFICHE,
                              element: <Notifiche />,
                            },
                            { path: routes.NOTIFICHE_DELEGATO, element: <Notifiche /> },
                            { path: routes.DETTAGLIO_NOTIFICA, element: <NotificationDetail /> },
                            {
                              path: routes.DETTAGLIO_NOTIFICA_DELEGATO,
                              element: <NotificationDetail />,
                            },
                            { path: routes.DELEGHE, element: <Deleghe /> },
                            { path: routes.NUOVA_DELEGA, element: <NuovaDelega /> },
                            { path: routes.RECAPITI, element: <Contacts /> },
                            { path: routes.PROFILO, element: <Profile /> },
                            { path: routes.APP_STATUS, element: <AppStatus /> },
                            { path: routes.SUPPORT, element: <SupportPage /> },
                            ...(IS_ONBOARDING_ENABLED
                              ? [
                                  {
                                    path: routes.ONBOARDING,
                                    element: <Onboarding />,
                                    children: [
                                      { index: true, element: <OnboardingHome /> },
                                      {
                                        path: routes.ONBOARDING_DIGITAL_DOMICILE,
                                        element: <DigitalDomicileWizard />,
                                      },
                                      {
                                        path: routes.ONBOARDING_IO,
                                        element: <IoActivationWizard />,
                                      },
                                      {
                                        path: routes.ONBOARDING_COURTESY,
                                        element: <OnboardingCourtesyWizard />,
                                      },
                                    ],
                                  },
                                ]
                              : []),
                            {
                              path: routes.DIGITAL_DOMICILE,
                              element: <DigitalContact />,
                              children: [
                                {
                                  index: true,
                                  element: <Navigate to={routes.RECAPITI} replace />,
                                },
                                {
                                  path: routes.DIGITAL_DOMICILE_ACTIVATION,
                                  element: <DigitalContactActivation />,
                                },
                                {
                                  path: routes.DIGITAL_DOMICILE_MANAGEMENT,
                                  element: <DigitalContactManagement />,
                                },
                              ],
                            },
                            {
                              path: '*',
                              element: (
                                <NotFound
                                  goBackAction={() =>
                                    router.navigate(routes.NOTIFICHE, { replace: true })
                                  }
                                />
                              ),
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: routes.PRIVACY_POLICY,
          element: <PrivacyPolicyPage />,
          children: [],
        },
        { path: routes.TERMS_OF_SERVICE, element: <TermsOfServicePage />, children: [] },
        {
          path: routes.TERMS_OF_SERVICE_SERCQ_SEND,
          element: <TermsOfServicePage type={ConsentType.TOS_SERCQ} />,
          children: [],
        },
        {
          path: routes.PARTICIPATING_ENTITIES,
          element: <ParticipatingEntitiesPage />,
          children: [],
        },
        { path: routes.TPP_LANDING, element: <TppLanding />, children: [] },
        { path: routes.NOT_ACCESSIBLE, element: <AppNotAccessibleRoute />, children: [] },
      ]),
    [IS_ONBOARDING_ENABLED]
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Router;
