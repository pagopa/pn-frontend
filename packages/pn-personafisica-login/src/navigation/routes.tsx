import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '../pages/login/Login';
import LoginError from '../pages/loginError/LoginError';
import Logout from '../pages/logout/Logout';
import OneIdentityCallback from '../pages/oneIdentityCallback/OneIdentityCallback';
import OneIdentityLogin from '../pages/oneIdentityLogin/OneIdentityLogin';
import OneIdentityLoginError from '../pages/oneIdentityLoginError/OneIdentityLoginError';
import SuccessPage from '../pages/success/Success';
import { getConfiguration } from '../services/configuration.service';
import {
  ROUTE_LOGIN,
  ROUTE_LOGIN_ERROR,
  ROUTE_LOGOUT,
  ROUTE_ONE_IDENTITY_CALLBACK,
  ROUTE_ONE_IDENTITY_LOGIN,
  ROUTE_ONE_IDENTITY_LOGIN_ERROR,
  ROUTE_SUCCESS,
} from './routes.const';

const onLoginRequest = () => <Login />;

function Router() {
  const { ONE_IDENTITY_LOGIN_ENABLED } = getConfiguration();

  return (
    <Routes>
      <Route path={ROUTE_LOGIN} element={onLoginRequest()} />
      <Route path={ROUTE_LOGIN_ERROR} element={<LoginError />} />
      <Route path={ROUTE_LOGOUT} element={<Logout />} />
      <Route path={ROUTE_SUCCESS} element={<SuccessPage />} />
      {ONE_IDENTITY_LOGIN_ENABLED && (
        <>
          <Route path={ROUTE_ONE_IDENTITY_LOGIN} element={<OneIdentityLogin />} />
          <Route path={ROUTE_ONE_IDENTITY_CALLBACK} element={<OneIdentityCallback />} />
          <Route path={ROUTE_ONE_IDENTITY_LOGIN_ERROR} element={<OneIdentityLoginError />} />
        </>
      )}
      <Route path="*" element={<Navigate to={ROUTE_LOGIN} replace />} />
    </Routes>
  );
}

export default Router;
