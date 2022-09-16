import { AccessDenied } from "@pagopa-pn/pn-commons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { goToLogin } from "./navigation.utility";
import * as routes from './routes.const';

const RouteGuard = () => {
  const navigate = useNavigate();
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);
  const { tos } = useAppSelector((state: RootState) => state.userState);

  return sessionToken 
    ? <Outlet /> 
    : <AccessDenied isLogged={!!sessionToken} 
        goToHomePage={() => navigate(tos ? routes.NOTIFICHE : routes.TOS, {replace: true})}
        goToLogin={() => goToLogin(window.location.href)}
      />
  ;
};

export default RouteGuard;
