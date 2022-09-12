import { Routes, Route } from 'react-router-dom';
import { NotFound } from '@pagopa-pn/pn-commons';

import Dashboard from '../pages/Dashboard.page';
import NotificationDetail from '../pages/NotificationDetail.page';
import NewNotification from '../pages/NewNotification.page';
import ApiKeys from '../pages/ApiKeys.page';
import { PNRole } from '../models/user';
import RequireAuth from './RequireAuth';
import VerifyUser from './VerifyUser';
import * as routes from './routes.const';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<VerifyUser />}>
        {/* protected routes */}
        <Route path="/"  element={<RequireAuth  roles={[PNRole.ADMIN, PNRole.OPERATOR]} />}>
          <Route path={routes.DASHBOARD} element={<Dashboard />} />
          <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
          <Route path={routes.NUOVA_NOTIFICA} element={<NewNotification />} />
          <Route path={routes.API_KEYS} element={<ApiKeys />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
