import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTE_LOGIN, ROUTE_LOGIN_ERROR, ROUTE_LOGOUT } from '../utils/constants';
import Login from '../pages/login/Login';
import Logout from '../pages/logout/Logout';
import LoginError from '../pages/loginError/LoginError';

/** login request operations */
const onLoginRequest = () => <Login />;

function Router() {
  return (
    <Routes>
      <Route path={ROUTE_LOGIN} element={onLoginRequest()} />
      <Route path={ROUTE_LOGIN_ERROR} element={<LoginError />} />
      <Route path={ROUTE_LOGOUT} element={<Logout />} />
      <Route path="*" element={<Navigate to={ROUTE_LOGIN} replace />} />
    </Routes>
  );
}

export default Router;