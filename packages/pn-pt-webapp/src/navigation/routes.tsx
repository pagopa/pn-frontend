import { Route, Routes, useNavigate } from 'react-router-dom';

import { NotFound } from '@pagopa-pn/pn-commons';

import { PNRole } from '../models/user';
import InstitutionsPage from '../pages/Institutions.page';
import AppNotAccessibleRoute from './AppNotAccessibleRoute';
import RouteGuard from './RouteGuard';
import SessionGuard from './SessionGuard';
import { HOME, NOT_ACCESSIBLE } from './routes.const';

const Router: React.FC = () => {
  const navigate = useNavigate();

  const navigateToHome = () => navigate(HOME, { replace: true });

  return (
    <Routes>
      <Route element={<SessionGuard />}>
        {/* protected routes */}
        <Route element={<RouteGuard roles={[PNRole.ADMIN, PNRole.OPERATOR]} />}>
          <Route path={HOME} element={<InstitutionsPage />} />
        </Route>
      </Route>
      <Route path={NOT_ACCESSIBLE} element={<AppNotAccessibleRoute />} />
      <Route path="*" element={<NotFound goBackAction={navigateToHome} />} />
    </Routes>
  );
};

export default Router;
