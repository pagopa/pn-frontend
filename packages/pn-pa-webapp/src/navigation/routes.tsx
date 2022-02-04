import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/dashboard.page';
import NotFound from './NotFound';
import RequireAuth from './RequiredAuth';
import VerifyUser from './VerifyUser/VerifyUser';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<VerifyUser />}></Route>
      {/* protected routes */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
