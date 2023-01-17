import React from 'react';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingPage, NotFound } from '@pagopa-pn/pn-commons';

import Prova from '../pages/Prova.page';
import AppStatus from '../pages/AppStatus.page';
import * as routes from './routes.const';
import RouteGuard from './RouteGuard';
import SessionGuard from './SessionGuard';

const NotificationDetail = React.lazy(() => import('../pages/NotificationDetail.page'));

function Router() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<SessionGuard />}>
          {/* protected routes */}
          <Route path="/" element={<RouteGuard />}>
            <Route path={routes.NOTIFICHE} element={<Prova />} />
            <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
            <Route path={routes.DELEGHE} element={<Prova />} />
            <Route path={routes.APP_STATUS} element={<AppStatus />} />
            <Route path="/" element={<Navigate to={routes.NOTIFICHE} />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
