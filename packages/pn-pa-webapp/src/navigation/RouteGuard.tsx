import { AccessDenied } from "@pagopa-pn/pn-commons";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { PNRole } from "../models/user";
import { logout } from "../redux/auth/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";

interface Props {
  roles: Array<PNRole>;
}

const RouteGuard = ({ roles }: Props) => {
  const dispatch = useAppDispatch();
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);
  const role = useAppSelector((state: RootState) => state.userState.user.organization?.roles[0]);

  const userHasRequiredRole = role && roles.includes(role.role);

  useEffect(() => {
    if (!sessionToken) {
      void dispatch(logout());
    }
  }, [sessionToken]);

  return userHasRequiredRole ? <Outlet /> : <AccessDenied />;
};

export default RouteGuard;
