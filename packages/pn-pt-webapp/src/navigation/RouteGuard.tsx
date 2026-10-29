import { Outlet, useNavigate } from 'react-router-dom';

import { AccessDenied } from '@pagopa-pn/pn-commons';

import { PNRole } from '../models/user';
import { authSelectors } from '../redux/auth/reducers';
import { useAppSelector } from '../redux/hooks';
import { goToSelfcareLogin } from './navigation.utility';
import { HOME } from './routes.const';

/**
 * The roles associated to the routes guarded by this Guard.
 * If null, then the route guard only verifies that the user is logged.
 */
interface Props {
  roles: Array<PNRole> | null;
}

const RouteGuard = ({ roles }: Props) => {
  const navigate = useNavigate();
  const role = useAppSelector(authSelectors.selectUserRole);

  const userHasRequiredRole = !roles || (role && roles.includes(role));

  if (!userHasRequiredRole) {
    return (
      <AccessDenied
        isLogged={true}
        goToHomePage={() => navigate(HOME, { replace: true })}
        goToLogin={() => goToSelfcareLogin()}
      />
    );
  }

  return <Outlet />;
};

export default RouteGuard;
