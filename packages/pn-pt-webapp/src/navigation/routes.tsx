import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { NotFound } from '@pagopa-pn/pn-commons';

import { PNRole } from '../models/user';
import InstitutionsPage from '../pages/Institutions.page';
import PrivacyPolicyPage from '../pages/PrivacyPolicy.page';
import TermsOfServicePage from '../pages/TermsOfService.page';
import AppNotAccessibleRoute from './AppNotAccessibleRoute';
import RouteGuard from './RouteGuard';
import SessionGuard from './SessionGuard';
import * as routes from './routes.const';

const Router: React.FC = () => {
  const navigate = useNavigate();

  const navigateToHome = () => navigate(routes.ENTI, { replace: true });

  return (
    <Routes>
      <Route element={<SessionGuard />}>
        {/* protected routes */}
        <Route element={<RouteGuard roles={[PNRole.ADMIN, PNRole.OPERATOR]} />}>
          <Route path={routes.ENTI} element={<InstitutionsPage />} />
          <Route path={routes.HOME} element={<Navigate to={routes.ENTI} replace />} />
        </Route>
      </Route>
      <Route path={routes.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
      <Route path={routes.TERMS_OF_SERVICE} element={<TermsOfServicePage />} />
      <Route path={routes.NOT_ACCESSIBLE} element={<AppNotAccessibleRoute />} />
      <Route path="*" element={<NotFound goBackAction={navigateToHome} />} />
    </Routes>
  );
};

export default Router;
