import { Outlet } from "react-router-dom";
import { LoadingPage } from "@pagopa-pn/pn-commons";

import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import ToSAcceptancePage from "../pages/ToSAcceptance.page";

const ToSGuard = () => {
  const { tos, fetchedTos } = useAppSelector((state: RootState) => state.userState);

  if (!fetchedTos) {
    return <LoadingPage />;
  }

  if (!tos) {
    return <ToSAcceptancePage />;
  }

  return <Outlet />;
};

export default ToSGuard;