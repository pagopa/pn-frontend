import { Outlet } from "react-router-dom";
import { LoadingPage } from "@pagopa-pn/pn-commons";
import { useEffect } from "react";

import { useAppDispatch } from "../redux/hooks";
import { getToSApproval } from "../redux/auth/actions";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import ToSAcceptancePage from "../pages/ToSAcceptance.page";


const ToSGuard = () => {
  const dispatch = useAppDispatch();
  const { tos, fetchedTos, isFirstAccept, consentVersion } = useAppSelector((state: RootState) => state.userState);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);

  const sessionToken = loggedUser.sessionToken;

  useEffect(() => {
    if (sessionToken !== '') {
      void dispatch(getToSApproval());
    }
  }, [sessionToken]);
  
  if (!fetchedTos) {
    return <LoadingPage />;
  }

  if (!tos) {
    return <ToSAcceptancePage isFirstAccept={isFirstAccept} consentVersion={consentVersion} />;
  }

  return <Outlet />;
};

export default ToSGuard;