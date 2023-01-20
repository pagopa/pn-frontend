import { AccessDenied } from "@pagopa-pn/pn-commons";
import { Outlet, useNavigate} from "react-router-dom";

import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { goToLoginPortal } from "./navigation.utility";
import * as routes from './routes.const';

const RouteGuard = () => {
  const navigate = useNavigate();
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);

  if (!sessionToken) {
    return (
      <AccessDenied
        isLogged={false}
        goToHomePage={() => navigate(routes.NOTIFICHE, {replace: true})}
        goToLogin={() => goToLoginPortal(window.location.href)}
      />
    );
  }

  return <Outlet />;
};

export default RouteGuard;
