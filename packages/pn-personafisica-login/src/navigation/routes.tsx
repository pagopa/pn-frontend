import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '../pages/login/Login';
import LoginError from '../pages/loginError/LoginError';
import Logout from '../pages/logout/Logout';
import SuccessPage from '../pages/success/Success';

const ROUTE_LOGOUT = '/logout';
export const ROUTE_LOGIN = '/login';
const ROUTE_LOGIN_ERROR = '/login/error';
const ROUTE_SUCCESS = '/login/success';

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
