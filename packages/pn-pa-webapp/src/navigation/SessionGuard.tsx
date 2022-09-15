import { appStateActions, InactivityHandler, SessionModal, useProcess, useSessionCheck } from "@pagopa-pn/pn-commons";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { exchangeToken, logout } from "../redux/auth/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { DISABLE_INACTIVITY_HANDLER } from "../utils/constants";
import { getHomePage } from "../utils/role.utility";
import { goToSelfcareLogin } from "./navigation.utility";

enum INITIALIZATION_STEPS {
  USER_DETERMINATION = "UserDetermination",
  INITIAL_PAGE_DETERMINATION = "InitialPageDetermination",
  SESSION_CHECK = "SessionCheck",
}

const INITIALIZATION_SEQUENCE = [
  INITIALIZATION_STEPS.USER_DETERMINATION, 
  INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION, INITIALIZATION_STEPS.SESSION_CHECK
];


const inactivityTimer = 5 * 60 * 1000;

/* eslint-disable sonarjs/cognitive-complexity */
const SessionGuard = () => {
  const location = useLocation();
  const isInitialized = useAppSelector((state: RootState) => state.appState.isInitialized);
  const { sessionToken, desired_exp: expDate  } = useAppSelector((state: RootState) => state.userState.user);
  const { isUnauthorizedUser, messageUnauthorizedUser, isClosedSession } = useAppSelector((state: RootState) => state.userState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));
  const { t } = useTranslation(['common']);

  const {isFinished, performStep} = useProcess(INITIALIZATION_SEQUENCE);

  // se un utente loggato fa reload, si deve evitare il navigate iniziale
  // questo si determina appena cominciata l'inizializzazione, se c'è già un sessionToken 
  // questo vuol dire che è stato preso da session storage, 
  // cioè siamo in presenza di un reload di un utente loggato
  const [isSessionReload, setIsSessionReload] = useState(false);

  const getTokenParam = useCallback(() => {
    const params = new URLSearchParams(location.hash);
    return params.get('#selfCareToken');
  }, [location]);

  /**
   * Step 1 - determinazione dell'utente - token exchange
   */
  useEffect(() => {
    const doUserDetermination = async () => {
      // se i dati del utente sono stati presi da session storage, 
      // si deve saltare la user determination e settare l'indicativo di session reload
      // che verrà usato nella initial page determination
      if (sessionToken) {
        console.log("SessionGuard - session reload detected");
        setIsSessionReload(true);
      } else {
        console.log("SessionGuard - in user determination");
        const selfCareToken = getTokenParam();
        if (selfCareToken) {
          await dispatch(exchangeToken(selfCareToken));
        }
      }
    };
    void performStep(INITIALIZATION_STEPS.USER_DETERMINATION, doUserDetermination);
  }, [performStep, getTokenParam]);

  /**
   * Step 2 - determinazione pagina iniziale
   */
  useEffect(() => {
    const doInitalPageDetermination = async () => {
      // l'analisi delle TOS ha senso solo se c'è un utente
      if (sessionToken) {
        console.log("SessionGuard - in initial page determination");

        // non si setta initial page se è un session reload
        const initialPage = isSessionReload ? undefined : getHomePage();
        if (initialPage) {
          navigate(initialPage, {replace: true});
        }
      }
    };
    void performStep(INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION, doInitalPageDetermination);
   }, [performStep]);

  /**
   * Step 3 - lancio del sessionCheck
   */
  useEffect(() => {
    void performStep(INITIALIZATION_STEPS.SESSION_CHECK, () => {
      console.log("SessionGuard - in session check launching");
      if (sessionToken) {
        sessionCheck(expDate);
      }
    });
  }, [performStep]);

  /**
   * Fine processo inizializzazione
   */
   useEffect(() => {
    if (!isInitialized && isFinished() ) {
      dispatch(appStateActions.finishInitialization());
    }
  }, [isInitialized, isFinished]);

  const isAnonymousUser = !isUnauthorizedUser && !sessionToken;

  const goodbyeMessage = {
    title: isUnauthorizedUser ? messageUnauthorizedUser.title : t('leaving-app.title'),
    message: isUnauthorizedUser ? messageUnauthorizedUser.message : t('leaving-app.message'),
  };

  return isInitialized 
    ? ( isUnauthorizedUser || isClosedSession
      ? <SessionModal
          open
          title={goodbyeMessage.title}
          message={goodbyeMessage.message}
          handleClose={goToSelfcareLogin}
          initTimeout
        />
      : isAnonymousUser || DISABLE_INACTIVITY_HANDLER 
        ? <Outlet />
        : <InactivityHandler inactivityTimer={inactivityTimer} onTimerExpired={() => dispatch(logout())}>
            <Outlet />
          </InactivityHandler>
      )
    : <div>Avviando app ...</div>;
};

export default SessionGuard;
