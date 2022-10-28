import { AccessDenied } from "@pagopa-pn/pn-commons";
import { Outlet, useNavigate } from "react-router-dom";
import { PNRole } from "../models/user";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getHomePage } from "../utils/role.utility";
import * as routes from './routes.const';
import { goToSelfcareLogin } from "./navigation.utility";

/**
 * The roles associated to the routes guarded by this Guard.
 * If null, then the route guard only verifies that the user is logged.
 */
interface Props {
  roles: Array<PNRole> | null;
}

const RouteGuard = ({ roles }: Props) => {
  const navigate = useNavigate();
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);
  const role = useAppSelector((state: RootState) => state.userState.user.organization?.roles[0]);
  const { tos } = useAppSelector((state: RootState) => state.userState);

  const userHasRequiredRole = !roles || (role && roles.includes(role.role));

  return !!sessionToken && userHasRequiredRole 
    ? <Outlet /> 
    : <AccessDenied isLogged={!!sessionToken} 
        goToHomePage={() => navigate(tos ? getHomePage() : routes.TOS, {replace: true})}
        goToLogin={() => goToSelfcareLogin()}
      />
  ;
};

export default RouteGuard;
