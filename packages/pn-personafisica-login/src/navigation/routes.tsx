import { Navigate, Route, Routes } from "react-router-dom";

import { storageOnSuccessOps } from "../utils/storage";
import Login from '../pages/login/Login';
import Logout from '../pages/logout/Logout';
import LoginError from '../pages/loginError/LoginError';
import SuccessPage from "../pages/success/Success";
import PrivacyPolicy from "../pages/privacyPolicy/PrivacyPolicy";
import { getConfiguration } from "../services/configuration.service";

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
  const {
    ROUTE_LOGIN,
    ROUTE_LOGIN_ERROR,
    ROUTE_LOGOUT,
    ROUTE_SUCCESS,
    ROUTE_PRIVACY_POLICY
  } = getConfiguration();

  return (
    <Routes>
      <Route path={ROUTE_LOGIN} element={onLoginRequest()} />
      <Route path={ROUTE_LOGIN_ERROR} element={<LoginError />} />
      <Route path={ROUTE_LOGOUT} element={<Logout />} />
      <Route path={ROUTE_SUCCESS} element={<SuccessPage />} />
      <Route path={ROUTE_PRIVACY_POLICY} element={<PrivacyPolicy />} />
      <Route path="*" element={<Navigate to={ROUTE_LOGIN} replace />} />
    </Routes>
  );
}

export default Router;