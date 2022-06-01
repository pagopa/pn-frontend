import { Routes, Route } from 'react-router-dom';
import { NotFound } from '@pagopa-pn/pn-commons';

import NotificationDetail from '../pages/NotificationDetail.page';
import NuovaDelega from '../pages/NuovaDelega.page';
import Notifiche from '../pages/Notifiche.page';
import Deleghe from '../pages/Deleghe.page';
import Contacts from '../pages/Contacts.page';
import Profile from '../pages/Profile.page';
import TermsOfService from '../pages/TermsOfService.page';
import RequireAuth from './RequireAuth';
import VerifyUser from './VerifyUser';
import * as routes from './routes.const';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<VerifyUser />}>
        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path={routes.TOS} element={<TermsOfService />} />
          <Route path={routes.NOTIFICHE} element={<Notifiche />} />
          <Route path={routes.NOTIFICHE_DELEGATO} element={<Notifiche isDelegator />} />
          <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
          <Route path={routes.DELEGHE} element={<Deleghe />} />
          <Route path={routes.NUOVA_DELEGA} element={<NuovaDelega />} />
          <Route path={routes.RECAPITI} element={<Contacts />} />
          <Route path={routes.PROFILO} element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
