import { Route, Routes, useNavigate } from 'react-router-dom';

import { NotFound } from '@pagopa-pn/pn-commons';

import InstitutionsPage from '../pages/Institutions.page';
import { HOME } from './routes.const';

const Router: React.FC = () => {
  const navigate = useNavigate();

  const navigateToHome = () => navigate(HOME, { replace: true });

  return (
    <Routes>
      <Route path={HOME} element={<InstitutionsPage />} />
      <Route path="*" element={<NotFound goBackAction={navigateToHome} />} />
    </Routes>
  );
};

export default Router;
