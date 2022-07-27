import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loading, NotFound } from '@pagopa-pn/pn-commons';

import Notifiche from '../pages/Notifiche.page';
import Profile from '../pages/Profile.page';
import TermsOfService from '../pages/TermsOfService.page';
import RequireAuth from './RequireAuth';
import VerifyUser from './VerifyUser';
import * as routes from './routes.const';

const NotificationDetail = React.lazy(() => import('../pages/NotificationDetail.page'));
const Contacts = React.lazy(() => import('../pages/Contacts.page'));
const Deleghe = React.lazy(() => import('../pages/Deleghe.page'));
const NuovaDelega = React.lazy(() => import('../pages/NuovaDelega.page'));

function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<VerifyUser />}>
          {/* protected routes */}
          <Route element={<RequireAuth />}>
            <Route path={routes.TOS} element={<TermsOfService />} />
            <Route path={routes.NOTIFICHE} element={<Notifiche />} />
            <Route path={routes.NOTIFICHE_DELEGATO} element={<Notifiche />} />
            <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
            <Route path={routes.DETTAGLIO_NOTIFICA_DELEGATO} element={<NotificationDetail />} />
            <Route path={routes.DELEGHE} element={<Deleghe />} />
            <Route path={routes.NUOVA_DELEGA} element={<NuovaDelega />} />
            <Route path={routes.RECAPITI} element={<Contacts />} />
            <Route path={routes.PROFILO} element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
