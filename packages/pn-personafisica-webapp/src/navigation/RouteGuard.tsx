import { Outlet, useNavigate } from 'react-router-dom';

import { AccessDenied } from '@pagopa-pn/pn-commons';

import { useRapidAccessParam } from '../hooks/useRapidAccessParam';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

const RouteGuard = () => {
  const navigate = useNavigate();
  const rapidAccess = useRapidAccessParam();
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);

  if (!sessionToken) {
    return (
      <AccessDenied
        isLogged={false}
        goToHomePage={() => navigate(routes.NOTIFICHE, { replace: true })}
        goToLogin={() => goToLoginPortal(rapidAccess)}
      />
    );
  }

  return <Outlet />;
};

export default RouteGuard;
