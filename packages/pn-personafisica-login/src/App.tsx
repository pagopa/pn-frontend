import Login from './pages/login/Login';
import {
  ROUTE_LOGIN,
  ROUTE_LOGIN_ERROR,
  ROUTE_LOGIN_SUCCESS,
  ROUTE_LOGOUT,
} from './utils/constants';
import LoginSuccess from './pages/loginSuccess/LoginSuccess';
import { redirectToLogin } from './utils/utils';
import ValidateSession from './pages/ValidateSession/ValidateSession';
import Logout from './pages/logout/Logout';
import LoginError from './pages/loginError/LoginError';
import { storageOnSuccessOps, storageTokenOps } from './utils/storage';

const onLogout = () => <Logout />;

const onLoginError = () => <LoginError />;

/** if exists already a session */
const onAlreadyInSession = (sessionToken: string) => (
  <ValidateSession sessionToken={sessionToken} />
);

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

const onLoginSuccess = () => <LoginSuccess />;

function App() {
  const token = storageTokenOps.read();

  if (window.location.pathname === ROUTE_LOGOUT) {
    return onLogout();
  } else if (token !== null && token !== undefined) {
    return onAlreadyInSession(token);
  } else {
    switch (window.location.pathname) {
      case ROUTE_LOGIN:
        return onLoginRequest();
      case ROUTE_LOGIN_SUCCESS:
        return onLoginSuccess();
      case ROUTE_LOGIN_ERROR:
        return onLoginError();
      default:
        redirectToLogin();
    }
  }

  return <div />;
}

export default App;
