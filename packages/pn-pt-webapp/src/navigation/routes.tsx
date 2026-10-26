import { Route, Routes } from 'react-router-dom';

import InstitutionsPage from '../pages/Institutions.page';
import { HOME } from './routes.const';

const Router: React.FC = () => (
  <Routes>
    <Route path={HOME} element={<InstitutionsPage />} />
  </Routes>
);

export default Router;
