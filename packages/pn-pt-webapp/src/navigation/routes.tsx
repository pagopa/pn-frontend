import { Route, Routes } from 'react-router-dom';

import Home from '../pages/Home.page';
import { HOME } from './routes.const';

const Router: React.FC = () => (
  <Routes>
    <Route path={HOME} element={<Home />} />
  </Routes>
);

export default Router;
