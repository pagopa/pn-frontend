import Login from './pages/login/Login';
import { ROUTE_LOGIN, ROUTE_LOGIN_ERROR, ROUTE_LOGOUT } from './utils/constants';
import { redirectToLogin } from './utils/utils';
import Logout from './pages/logout/Logout';
import LoginError from './pages/loginError/LoginError';
import { storageOnSuccessOps } from './utils/storage';

const onLogout = () => <Logout />;

const onLoginError = () => <LoginError />;

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

function App() {
  if (window.location.pathname === ROUTE_LOGOUT) {
    return onLogout();
  } else {
    switch (window.location.pathname) {
      case ROUTE_LOGIN:
        return onLoginRequest();
      case ROUTE_LOGIN_ERROR:
        return onLoginError();
      default:
        redirectToLogin();
    }
  }

  return <div />;
}

export default App;
