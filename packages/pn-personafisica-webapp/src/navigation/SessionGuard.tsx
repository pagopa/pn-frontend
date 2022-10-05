import { appStateActions, InactivityHandler, SessionModal, useProcess, useSessionCheck } from "@pagopa-pn/pn-commons";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { exchangeToken, getToSApproval, logout } from "../redux/auth/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { DISABLE_INACTIVITY_HANDLER } from "../utils/constants";
import { goToLoginPortal } from "./navigation.utility";
import * as routes from './routes.const';

enum INITIALIZATION_STEPS {
  USER_DETERMINATION = "UserDetermination",
  FETCH_TOS_STATUS = "ObtainTosStatus",
  INITIAL_PAGE_DETERMINATION = "InitialPageDetermination",
}

const INITIALIZATION_SEQUENCE = [
  INITIALIZATION_STEPS.USER_DETERMINATION, INITIALIZATION_STEPS.FETCH_TOS_STATUS,
  INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION
];


const inactivityTimer = 5 * 60 * 1000;

async function doUserDeterminationIndependent(sessionToken: string, setIsSessionReload: (b: boolean) => void, getTokenParam: () => string | null, doExchangeToken: (st: string) => Promise<any>) {
  // se i dati del utente sono stati presi da session storage, 
  // si deve saltare la user determination e settare l'indicativo di session reload
  // che verrà usato nella initial page determination
  if (sessionToken) {
    setIsSessionReload(true);
  } else {
    const spidToken = getTokenParam();
    if (spidToken) {
      await doExchangeToken(spidToken);
    }
  }
}

async function doInitalPageDetermination(sessionToken: string, isClosedSession: boolean, tos: boolean, isSessionReload: boolean, navigate: any, sessionCheck: any, expDate: any) {
  // l'analisi delle TOS ha senso solo se c'è un utente
  if (sessionToken && !isClosedSession) {

    // non si setta initial page se è un session reload di un utente che ha già accettato i TOS
    const initialPage = tos
      ? (isSessionReload ? undefined : routes.NOTIFICHE) 
      : routes.TOS;
    if (initialPage) {
      navigate(initialPage, {replace: true});
    }
    sessionCheck(expDate);
  }
}

const SessionGuardGraphical = ({ isInitialized, isUnauthorizedUser, isClosedSession, goodbyeMessage, isAnonymousUser}: { isInitialized: boolean, isUnauthorizedUser: boolean, isClosedSession: boolean, goodbyeMessage: { title: string, message: string}, isAnonymousUser: boolean }) => isInitialized 
? ( isUnauthorizedUser || isClosedSession
  ? <SessionModal
      open
      title={goodbyeMessage.title}
      message={goodbyeMessage.message}
      handleClose={() => goToLoginPortal(window.location.href)}
      initTimeout
    />
  : isAnonymousUser || DISABLE_INACTIVITY_HANDLER 
    ? <Outlet />
    : <InactivityHandler inactivityTimer={inactivityTimer} onTimerExpired={() => dispatch(logout())}>
        <Outlet />
      </InactivityHandler>
  )
: <div>Avviando app ...</div>;

const SessionGuard = () => {
  const location = useLocation();
  const isInitialized = useAppSelector((state: RootState) => state.appState.isInitialized);
  const { sessionToken, exp: expDate  } = useAppSelector((state: RootState) => state.userState.user);
  const { isUnauthorizedUser, messageUnauthorizedUser, isClosedSession, tos } = useAppSelector((state: RootState) => state.userState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));
  const { t } = useTranslation(['common']);

  const {isFinished, performStep} = useProcess(INITIALIZATION_SEQUENCE);

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
    void performStep(INITIALIZATION_STEPS.USER_DETERMINATION, () => doUserDeterminationIndependent(
      sessionToken, setIsSessionReload, getTokenParam, t => dispatch(exchangeToken(t))
    ));
  }, [performStep]);


  /**
   * Step 2 - ottenere TOS status
   * NB: questo l'ho definito in uno step separato, per essere sicuro che nello step successivo 
   *     l'attributo tos dello store sia settato.
   *     Avevo fatto un'altra implementazione nella cui si prendeva il risultato del dispatch,
   *     ma questo faceva andare alcuni tests in errore. Perciò ho adottato questa soluzione.
   */

  const doFetchTOSStatus = async () => {
    // l'analisi delle TOS ha senso solo se c'è un utente
    if (sessionToken && !isClosedSession) {
      await dispatch(getToSApproval());
    }
  };

  useEffect(() => {
    void performStep(INITIALIZATION_STEPS.FETCH_TOS_STATUS, doFetchTOSStatus);
  }, [performStep]);
  
  /**
   * Step 3 - determinazione pagina iniziale + sessionCheck
   */

  useEffect(() => {
    void performStep(INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION, () => doInitalPageDetermination(sessionToken, isClosedSession, tos, isSessionReload, navigate, sessionCheck, expDate));
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

  return <SessionGuardGraphical goodbyeMessage={goodbyeMessage} isAnonymousUser={isAnonymousUser} isClosedSession={isClosedSession}>
};

export default SessionGuard;
