import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AccessDenied, AppRouteParams } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

const RouteGuard = () => {
  const navigate = useNavigate();
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
