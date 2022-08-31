import { Outlet } from 'react-router-dom';
import { Fragment } from "react";
import InactivityHandler from "./InactivityHandler";
import SessionModal from "./SessionModal";

const inactivityTimer = 5 * 60 * 1000;

interface Props {
  accessDenied: boolean,
  goodbyeMessage: { title: string, message: string },
  disableInactivityHandler: string | boolean,
  goToLogin: () => void,
  doLogout: () => void,
}

const HandleAuth = (props: Props) => {
  const { accessDenied, goodbyeMessage, goToLogin, disableInactivityHandler, doLogout } = props;

  return (
    <Fragment>
      {accessDenied && 
        <SessionModal
          open
          title={goodbyeMessage.title}
          message={goodbyeMessage.message}
          handleClose={goToLogin}
          initTimeout
        />
      }
      {disableInactivityHandler ? (
        <Outlet />
      ) : (
        <InactivityHandler
          inactivityTimer={inactivityTimer}
          onTimerExpired={doLogout}
        >
          <Outlet />
        </InactivityHandler>
      )}
    </Fragment>
  );
}

export default HandleAuth;