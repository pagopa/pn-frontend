import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '../pages/login/Login';
import LoginError from '../pages/loginError/LoginError';
import Logout from '../pages/logout/Logout';
import SuccessPage from '../pages/success/Success';
import { ROUTE_LOGIN, ROUTE_LOGIN_ERROR, ROUTE_LOGOUT, ROUTE_SUCCESS } from './routes.const';

/** login request operations */
const onLoginRequest = () => <Login />;

function Router() {
  return (
    <Routes>
      <Route path={ROUTE_LOGIN} element={onLoginRequest()} />
      <Route path={ROUTE_LOGIN_ERROR} element={<LoginError />} />
      <Route path={ROUTE_LOGOUT} element={<Logout />} />
      <Route path={ROUTE_SUCCESS} element={<SuccessPage />} />
      <Route path="*" element={<Navigate to={ROUTE_LOGIN} replace />} />
    </Routes>
  );
}

export default Router;
