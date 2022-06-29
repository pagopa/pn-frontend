import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTE_LOGIN, ROUTE_LOGIN_ERROR, ROUTE_LOGOUT } from '../utils/constants';
import { storageOnSuccessOps } from "../utils/storage";
import Login from '../pages/login/Login';
import Logout from '../pages/logout/Logout';
import LoginError from '../pages/loginError/LoginError';

/** login request operations */
const onLoginRequest = () => {
  storageOnSuccessOps.delete();
  handleLoginRequestOnSuccessRequest();
  return <Login />;
};

const handleLoginRequestOnSuccessRequest = () => {
  const onSuccess: string | null = new URLSearchParams(window.location.search).get('onSuccess');
  // mixpanel tracking event
  // trackEvent('LOGIN_INTENT', { target: onSuccess ?? 'dashboard' });
  if (onSuccess) {
    storageOnSuccessOps.write(onSuccess);
  }
};

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