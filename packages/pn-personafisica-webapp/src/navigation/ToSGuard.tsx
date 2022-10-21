import { Outlet } from "react-router-dom";

import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import ToSAcceptancePage from "../pages/ToSAcceptance.page";

const ToSGuard = () => {
  const { tos } = useAppSelector((state: RootState) => state.userState);

  if (!tos) {
    return <ToSAcceptancePage />;
  }

  return <Outlet />;
};

export default ToSGuard;