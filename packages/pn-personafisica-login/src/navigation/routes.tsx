import { Navigate, Route, Routes } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Login from '../pages/login/Login';
import LoginError from '../pages/loginError/LoginError';
import Logout from '../pages/logout/Logout';
import SuccessPage from '../pages/success/Success';
import {
  ROUTE_LOGIN,
  ROUTE_LOGIN_ERROR,
  ROUTE_LOGOUT,
  ROUTE_ONEIDENTITY,
  ROUTE_SUCCESS,
} from './routes.const';

/** login request operations */
const onLoginRequest = () => <Login />;

const generateRandomUniqueString = () => uuidv4().replace(/-/g, '').slice(0, 15);
const state = generateRandomUniqueString();
const nonce = generateRandomUniqueString();
const clientId = 'DFCUf4W3KHfKUl4USEVYrMgpMxvyKICHM_ZPiZ3ftm0';
const redirect_uri = `https://cittadini.dev.notifichedigitali.it/auth/callback`;
const encodedRedirectUri = encodeURIComponent(redirect_uri);

const TestOIDCRedirect = () => {
  const oidcUrl = `https://uat.oneid.pagopa.it/login?response_type=CODE&scope=openid&client_id=${clientId}&state=${state}&nonce=${nonce}&redirect_uri=${encodedRedirectUri}`;

  return (
    <>
      <div>OIDC Redirect Placeholder</div>
      <a href={oidcUrl}>Login with OIDC</a>
    </>
  );
};

const OneIdentity = () => <div>OneIdentity Placeholder</div>;

function Router() {
  return (
    <Routes>
      <Route path={ROUTE_LOGIN} element={<TestOIDCRedirect />} />
      <Route path={ROUTE_LOGIN_ERROR} element={<LoginError />} />
      <Route path={ROUTE_LOGOUT} element={<Logout />} />
      <Route path={ROUTE_SUCCESS} element={<SuccessPage />} />
      <Route path={ROUTE_ONEIDENTITY} element={<OneIdentity />} />
    </Routes>
  );
}

export default Router;
