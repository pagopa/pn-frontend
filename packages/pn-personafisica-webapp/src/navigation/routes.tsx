import { Routes, Route } from 'react-router-dom';
import { NotFound } from '@pagopa-pn/pn-commons';

import NotificationDetail from '../pages/NotificationDetail.page';
import NuovaDelega from '../pages/NuovaDelega.page';
import Notifiche from '../pages/Notifiche.page';
import Deleghe from "../pages/Deleghe.page";
import RequireAuth from './RequiredAuth';
import VerifyUser from './VerifyUser';
import * as routes from './routes.const';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<VerifyUser />}></Route>
              <Route path={routes.NUOVA_DELEGA} element={<NuovaDelega />} />

      {/* protected routes */}
      <Route element={<RequireAuth />}>
        <Route path={routes.NOTIFICHE} element={<Notifiche/>} />
        <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
        <Route path={routes.DELEGHE} element={<Deleghe/>} />
        <Route path={routes.NUOVA_DELEGA} element={<NuovaDelega />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
