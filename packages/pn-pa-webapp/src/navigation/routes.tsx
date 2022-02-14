import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/dashboard.page';
import { UserRole } from '../models/user';

import NotFound from './NotFound';
import RequireAuth from './RequiredAuth';
import VerifyUser from './VerifyUser/VerifyUser';
import * as routes from './routes.const';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<VerifyUser />}></Route>
      {/* protected routes */}
      <Route element={<RequireAuth roles={[UserRole.REFERENTE_AMMINISTRATIVO]} />}>
        <Route path={routes.DASHBOARD} element={<Dashboard />} />
        <Route path={routes.ROLES} element={<h1>Ruoli</h1>} />
        <Route path={routes.GROUPS} element={<h1>Gruppi</h1>} />
      </Route>
      <Route
        element={
          <RequireAuth roles={[UserRole.REFERENTE_AMMINISTRATIVO, UserRole.REFERENTE_OPERATIVO]} />
        }
      >
        <Route path={routes.API_KEYS} element={<h1>Api Keys</h1>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
