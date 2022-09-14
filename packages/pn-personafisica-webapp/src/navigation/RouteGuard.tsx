import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { logout } from "../redux/auth/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";

const RouteGuard = () => {
  const dispatch = useAppDispatch();
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);

  useEffect(() => {
    if (!sessionToken) {
      void dispatch(logout());
    }
  }, [sessionToken]);

  return <Outlet />; 
};

export default RouteGuard;
