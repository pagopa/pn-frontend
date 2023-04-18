// momentarily commented for pn-5157
// import { AccessDenied, AppRouteParams, AppRouteType } from '@pagopa-pn/pn-commons';
import { AccessDenied, AppRouteParams } from '@pagopa-pn/pn-commons';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

const RouteGuard = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);

  if (!sessionToken) {
    return (
      <AccessDenied
        isLogged={false}
        goToHomePage={() => navigate(routes.NOTIFICHE, { replace: true })}
        // momentarily commented for pn-5157
        // goToLogin={() => goToLoginPortal(AppRouteType.PF, params.get(AppRouteParams.AAR))}
        goToLogin={() => goToLoginPortal(params.get(AppRouteParams.AAR))}
      />
    );
  }

  return <Outlet />;
};

export default RouteGuard;
