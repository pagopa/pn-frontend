import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/dashboard.page';
import VerifyUser from './VerifyUser/VerifyUser';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<VerifyUser />}></Route>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default Router;
