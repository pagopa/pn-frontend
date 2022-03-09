import { Routes, Route } from 'react-router-dom';
import { NotFound } from '@pagopa-pn/pn-commons';

import Notifiche from '../pages/Notifiche.page';
import RequireAuth from './RequiredAuth';
import VerifyUser from './VerifyUser';
import * as routes from './routes.const';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<VerifyUser />}>
        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path={routes.NOTIFICHE} element={<Notifiche />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
