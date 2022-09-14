import { appStateActions, InactivityHandler, SessionModal, useSessionCheck } from "@pagopa-pn/pn-commons";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { exchangeToken, getToSApproval, logout } from "../redux/auth/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { DISABLE_INACTIVITY_HANDLER } from "../utils/constants";
import { goToLogin } from "./navigation.utility";
import * as routes from './routes.const';

enum INITIALIZATION_STAGES {
  NON_STARTED = 'NonStarted',
  USER_DETERMINATION_STARTED = "UserDeterminationStarted",
  USER_DETERMINATION_FINISHED = "UserDeterminationFinished",
  INITIAL_PAGE_DETERMINATION_STARTED = "InitialPageDeterminationStarted",
  INITIAL_PAGE_DETERMINATION_FINISHED = "InitialPageDeterminationFinished",
  SESSION_CHECK_STARTED = "SessionCheckStarted",
  INITIALIZATION_FINISHED = "InitializationFinished",
}

const inactivityTimer = 5 * 60 * 1000;

/* eslint-disable sonarjs/cognitive-complexity */
const SessionGuard = () => {
  const location = useLocation();
  const [initializationStage, setInitializationStage] = useState(INITIALIZATION_STAGES.NON_STARTED);
  const isInitialized = useAppSelector((state: RootState) => state.appState.isInitialized);
  const { sessionToken, exp: expDate  } = useAppSelector((state: RootState) => state.userState.user);
  const { isUnauthorizedUser, isClosedSession } = useAppSelector((state: RootState) => state.userState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));

  // se un utente loggato fa reload, si deve evitare il navigate verso notifiche
  // questo si determina appena cominciata l'inizializzazione, se c'è già un sessionToken 
  // questo vuol dire che è stato preso da session storage, 
  // cioè siamo in presenza di un reload di un utente loggato
  const [isSessionReload, setIsSessionReload] = useState(false);

  const getTokenParam = useCallback(() => {
    const params = new URLSearchParams(location.hash);
    return params.get('#token');
  }, [location]);

  /**
   * Step 1 - determinazione dell'utente - token exchange
   */
  useEffect(() => {
    const doUserDetermination = async () => {
      setInitializationStage(INITIALIZATION_STAGES.USER_DETERMINATION_STARTED);
      // se i dati del utente sono stati presi da session storage, 
      // si deve saltare la user determination e settare l'indicativo di session reload
      // che verrà usato nella initial page determination
      if (sessionToken) {
        console.log("SessionGuard - session reload detected");
        setIsSessionReload(true);
      } else {
        console.log("SessionGuard - in user determination");
        const spidToken = getTokenParam();
        if (spidToken) {
          await dispatch(exchangeToken(spidToken));
        }
      }
      // sia perché fatta perché non necessaria,
      // a questo punto la user determination può considerarsi finita
      setInitializationStage(INITIALIZATION_STAGES.USER_DETERMINATION_FINISHED);
    };
    if (initializationStage === INITIALIZATION_STAGES.NON_STARTED) {
      void doUserDetermination();
    }
  }, [initializationStage, getTokenParam]);

  /**
   * Step 2 - determinazione pagina iniziale
   */
   useEffect(() => {
    const doInitalPageDetermination = async () => {
      setInitializationStage(INITIALIZATION_STAGES.INITIAL_PAGE_DETERMINATION_STARTED);
      // l'analisi delle TOS ha senso solo se c'è un utente
      if (sessionToken) {
        console.log("SessionGuard - in initial page determination - about to query TOS");
        const tosResult: any = await dispatch(getToSApproval());

        // non si setta initial page se è un session reload di un utente che ha già accettato i TOS
        const initialPage = tosResult.payload.accepted 
          ? (isSessionReload ? undefined : routes.NOTIFICHE) 
          : routes.TOS;
        console.log("SessionGuard - in initial page determination - TOS result");
        console.log({ tosResult, initialPage });
        if (initialPage) {
          navigate(initialPage, {replace: true});
        }
      }
      setInitializationStage(INITIALIZATION_STAGES.INITIAL_PAGE_DETERMINATION_FINISHED);
    };
    if (initializationStage === INITIALIZATION_STAGES.USER_DETERMINATION_FINISHED) {
      void doInitalPageDetermination();
    }
  }, [initializationStage]);

  /**
   * Step 3 - lancio del sessionCheck
   */
   useEffect(() => {
    if (initializationStage === INITIALIZATION_STAGES.INITIAL_PAGE_DETERMINATION_FINISHED) {
      setInitializationStage(INITIALIZATION_STAGES.SESSION_CHECK_STARTED);
      console.log("SessionGuard - in session check launching");
      if (sessionToken) {
        sessionCheck(expDate);
      }
      setInitializationStage(INITIALIZATION_STAGES.INITIALIZATION_FINISHED);
    }
  }, [initializationStage]);

  /**
   * Fine processo inizializzazione
   */
   useEffect(() => {
    if (!isInitialized && initializationStage === INITIALIZATION_STAGES.INITIALIZATION_FINISHED) {
      dispatch(appStateActions.finishInitialization());
    }
  }, [isInitialized, initializationStage]);

  const isAnonymousUser = !isUnauthorizedUser && !sessionToken;

  return isInitialized 
    ? ( isUnauthorizedUser || isClosedSession
      ? <SessionModal
          open
          title="Cosa fai qua?"
          message="Vattene via dai"
          handleClose={() => goToLogin(window.location.href)}
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
