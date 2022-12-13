import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingPage, NotFound } from '@pagopa-pn/pn-commons';

import Prova from '../pages/Prova.page';
import * as routes from './routes.const';
import RouteGuard from './RouteGuard';
import SessionGuard from './SessionGuard';

function Router() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<SessionGuard />}>
          {/* protected routes */}
          <Route path="/" element={<RouteGuard />}>
            <Route path={routes.PROVA} element={<Prova />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
