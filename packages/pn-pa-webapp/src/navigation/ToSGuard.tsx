import { Outlet } from "react-router-dom";

import TermsOfService from "../pages/TermsOfService.page";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";

const ToSGuard = () => {
  const { tos } = useAppSelector((state: RootState) => state.userState);

  if (!tos) {
    return <TermsOfService />;
  }

  return <Outlet />;
};

export default ToSGuard;