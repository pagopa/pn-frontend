import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingPage, NotFound } from '@pagopa-pn/pn-commons';

import PrivacyTOSPage from "../pages/PrivacyTOS.page";
import RequireAuth from './RequireAuth';
import VerifyUser from './VerifyUser';
import * as routes from './routes.const';

const Profile = React.lazy(() => import('../pages/Profile.page'));
const TermsOfService = React.lazy(() => import('../pages/TermsOfService.page'));
const Notifiche = React.lazy(() => import('../pages/Notifiche.page'));
const NotificationDetail = React.lazy(() => import('../pages/NotificationDetail.page'));
const Contacts = React.lazy(() => import('../pages/Contacts.page'));
const Deleghe = React.lazy(() => import('../pages/Deleghe.page'));
const NuovaDelega = React.lazy(() => import('../pages/NuovaDelega.page'));

function Router() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<VerifyUser />}>
          {/* protected routes */}
          <Route path="/" element={<RequireAuth />}>
            <Route path={routes.TOS} element={<TermsOfService />} />
            <Route path={routes.NOTIFICHE} element={<Notifiche />} />
            <Route path={routes.NOTIFICHE_DELEGATO} element={<Notifiche />} />
            <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
            <Route path={routes.DETTAGLIO_NOTIFICA_DELEGATO} element={<NotificationDetail />} />
            <Route path={routes.DELEGHE} element={<Deleghe />} />
            <Route path={routes.NUOVA_DELEGA} element={<NuovaDelega />} />
            <Route path={routes.RECAPITI} element={<Contacts/>} />
            <Route path={routes.PROFILO} element={<Profile />} />
          </Route>
        </Route>
        <Route path={routes.PRIVACY_TOS} element={<PrivacyTOSPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
