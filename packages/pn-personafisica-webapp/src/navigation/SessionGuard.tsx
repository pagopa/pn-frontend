import { appStateActions, InactivityHandler, SessionModal, useSessionCheck } from "@pagopa-pn/pn-commons";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { exchangeToken, getToSApproval, logout } from "../redux/auth/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { DISABLE_INACTIVITY_HANDLER } from "../utils/constants";
import { goToLogin } from "./navigation.utility";
import * as routes from './routes.const';

// enum INITIALIZATION_STAGES_2 {
//   NON_STARTED = 'NonStarted',
//   USER_DETERMINATION_STARTED = "UserDeterminationStarted",
//   USER_DETERMINATION_FINISHED = "UserDeterminationFinished",
//   INITIAL_PAGE_DETERMINATION_STARTED = "InitialPageDeterminationStarted",
//   INITIAL_PAGE_DETERMINATION_FINISHED = "InitialPageDeterminationFinished",
//   SESSION_CHECK_STARTED = "SessionCheckStarted",
//   INITIALIZATION_FINISHED = "InitializationFinished",
// }

enum INITIALIZATION_STEPS {
  NOT_STARTED = 'NotStarted',
  USER_DETERMINATION = "UserDetermination",
  INITIAL_PAGE_DETERMINATION = "InitialPageDetermination",
  SESSION_CHECK = "SessionCheck",
}

const INITIALIZATION_SEQUENCE = [
  INITIALIZATION_STEPS.NOT_STARTED, INITIALIZATION_STEPS.USER_DETERMINATION, 
  INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION, INITIALIZATION_STEPS.SESSION_CHECK
];


const inactivityTimer = 5 * 60 * 1000;

/* eslint-disable sonarjs/cognitive-complexity */
const SessionGuard = () => {
  const location = useLocation();
  const isInitialized = useAppSelector((state: RootState) => state.appState.isInitialized);
  const { sessionToken, exp: expDate  } = useAppSelector((state: RootState) => state.userState.user);
  const { isUnauthorizedUser, isClosedSession } = useAppSelector((state: RootState) => state.userState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));

  // const [initializationStage, setInitializationStage] = useState(INITIALIZATION_STAGES_2.NON_STARTED);
  const [currentSituation, setCurrentSituation] = useState({ step: INITIALIZATION_STEPS.NOT_STARTED, isActive: false });

  // se un utente loggato fa reload, si deve evitare il navigate verso notifiche
  // questo si determina appena cominciata l'inizializzazione, se c'è già un sessionToken 
  // questo vuol dire che è stato preso da session storage, 
  // cioè siamo in presenza di un reload di un utente loggato
  const [isSessionReload, setIsSessionReload] = useState(false);

  /* eslint-disable-next-line arrow-body-style */
  const mustProceedToStep = useCallback((step: INITIALIZATION_STEPS) => {
    return INITIALIZATION_SEQUENCE.indexOf(currentSituation.step) === INITIALIZATION_SEQUENCE.indexOf(step) - 1
      && !currentSituation.isActive;
  }, [currentSituation]);

  /* eslint-disable-next-line arrow-body-style */
  const isFinished = useCallback(() => {
    return INITIALIZATION_SEQUENCE.indexOf(currentSituation.step) === INITIALIZATION_SEQUENCE.length - 1
      && !currentSituation.isActive;
  }, [currentSituation]);

  const startStep = useCallback((step: INITIALIZATION_STEPS) => {
    setCurrentSituation({ step, isActive: true });
  }, []);

  const endCurrentStep = useCallback(() => {
    setCurrentSituation(currentValue => ({...currentValue, isActive: false }));
  }, []);

  const getTokenParam = useCallback(() => {
    const params = new URLSearchParams(location.hash);
    return params.get('#token');
  }, [location]);

  /**
   * Step 1 - determinazione dell'utente - token exchange
   */
  useEffect(() => {
    const doUserDetermination = async () => {
      // setInitializationStage(INITIALIZATION_STAGES_2.USER_DETERMINATION_STARTED);
      startStep(INITIALIZATION_STEPS.USER_DETERMINATION);
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
      // setInitializationStage(INITIALIZATION_STAGES_2.USER_DETERMINATION_FINISHED);
      endCurrentStep();
    };
    if (mustProceedToStep(INITIALIZATION_STEPS.USER_DETERMINATION)) {
      void doUserDetermination();
    }
  // }, [initializationStage, getTokenParam]);
  }, [mustProceedToStep, startStep, endCurrentStep, getTokenParam]);

  /**
   * Step 2 - determinazione pagina iniziale
   */
  useEffect(() => {
    const doInitalPageDetermination = async () => {
      // setInitializationStage(INITIALIZATION_STAGES_2.INITIAL_PAGE_DETERMINATION_STARTED);
      startStep(INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION);
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
      // setInitializationStage(INITIALIZATION_STAGES_2.INITIAL_PAGE_DETERMINATION_FINISHED);
      endCurrentStep();
    };
    // if (initializationStage === INITIALIZATION_STAGES_2.USER_DETERMINATION_FINISHED) {
    if (mustProceedToStep(INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION)) {
      void doInitalPageDetermination();
    }
  // }, [initializationStage]);
   }, [mustProceedToStep, startStep, endCurrentStep]);

  /**
   * Step 3 - lancio del sessionCheck
   */
  useEffect(() => {
    // if (initializationStage === INITIALIZATION_STAGES_2.INITIAL_PAGE_DETERMINATION_FINISHED) {
    //   setInitializationStage(INITIALIZATION_STAGES_2.SESSION_CHECK_STARTED);
    if (mustProceedToStep(INITIALIZATION_STEPS.SESSION_CHECK)) {
      startStep(INITIALIZATION_STEPS.SESSION_CHECK);
      console.log("SessionGuard - in session check launching");
      if (sessionToken) {
        sessionCheck(expDate);
      }
      endCurrentStep();
      // setInitializationStage(INITIALIZATION_STAGES_2.INITIALIZATION_FINISHED);
    }
  // }, [initializationStage]);
  }, [mustProceedToStep, startStep, endCurrentStep]);

  /**
   * Fine processo inizializzazione
   */
   useEffect(() => {
    if (!isInitialized && isFinished() /* initializationStage === INITIALIZATION_STAGES_2.INITIALIZATION_FINISHED */ ) {
      dispatch(appStateActions.finishInitialization());
    }
  }, [isInitialized, /* initializationStage */ isFinished]);

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
