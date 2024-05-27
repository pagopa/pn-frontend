import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { AccessDenied, AppRouteParams, sanitizeString } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

const RouteGuard = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);
  const location = useLocation();

  useEffect(() => {
    const aar = localStorage.getItem(AppRouteParams.AAR);
    if (aar && sessionToken) {
      const params = new URLSearchParams();
      params.append('aar', aar);
      navigate({ pathname: location.pathname, search: '?' + params.toString() }, { replace: true });
      localStorage.removeItem(AppRouteParams.AAR);
    }
  }, [location.pathname]);

  if (!sessionToken) {
    const aar = params.get(AppRouteParams.AAR);
    if (aar) {
      // save to localstorage
      localStorage.setItem(AppRouteParams.AAR, sanitizeString(aar));
      goToLoginPortal();
    }
    return (
      <AccessDenied
        isLogged={false}
        goToHomePage={() => navigate(routes.NOTIFICHE, { replace: true })}
        goToLogin={() => goToLoginPortal()}
      />
    );
  }

  return <Outlet />;
};

export default RouteGuard;
