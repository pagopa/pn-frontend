import {
  appStateActions,
  InactivityHandler,
  SessionModal,
  useProcess,
  useSessionCheck,
} from '@pagopa-pn/pn-commons';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { exchangeToken, getToSApproval, logout } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { DISABLE_INACTIVITY_HANDLER } from '../utils/constants';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

enum INITIALIZATION_STEPS {
  USER_DETERMINATION = 'UserDetermination',
  FETCH_TOS_STATUS = 'ObtainTosStatus',
  INITIAL_PAGE_DETERMINATION = 'InitialPageDetermination',
  SESSION_CHECK = 'SessionCheck',
}

const INITIALIZATION_SEQUENCE = [
  INITIALIZATION_STEPS.USER_DETERMINATION,
  INITIALIZATION_STEPS.FETCH_TOS_STATUS,
  INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION,
  INITIALIZATION_STEPS.SESSION_CHECK,
];

const inactivityTimer = 5 * 60 * 1000;

// Perché ci sono due componenti.
// Il codice in SessionGuard implementa i steps necessari per determinare se c'è sessione, se è utente abilitato, se è sessione anonima, ecc..
// D'altra parte, SessionGuardRender implementa la logica di cosa si deve renderizzare,
// con casi speciali per utente non abilitato e sessione chiusa, ed anche l'analisi dello InactivityHandler
// -----------------------------
// Carlos Lombardi, 2022.10.05

/**
 * SessionGuardRender: logica di renderizzazione
 */
const SessionGuardRender = () => {
  const isInitialized = useAppSelector((state: RootState) => state.appState.isInitialized);
  const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);
  const { isUnauthorizedUser, messageUnauthorizedUser, isClosedSession } = useAppSelector(
    (state: RootState) => state.userState
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common']);

  const isAnonymousUser = !isUnauthorizedUser && !sessionToken;

  const goodbyeMessage = {
    title: isUnauthorizedUser ? messageUnauthorizedUser.title : t('leaving-app.title'),
    message: isUnauthorizedUser ? messageUnauthorizedUser.message : t('leaving-app.message'),
  };

  const renderIfInitialized = () =>
    isUnauthorizedUser || isClosedSession ? (
      <SessionModal
        open
        title={goodbyeMessage.title}
        message={goodbyeMessage.message}
        handleClose={() => goToLoginPortal(window.location.href)}
        initTimeout
      />
    ) : isAnonymousUser || DISABLE_INACTIVITY_HANDLER ? (
      <Outlet />
    ) : (
      <InactivityHandler
        inactivityTimer={inactivityTimer}
        onTimerExpired={() => dispatch(logout())}
      >
        <Outlet />
      </InactivityHandler>
    );

  return isInitialized ? renderIfInitialized() : <Fragment></Fragment>;
};

/**
 * SessionGuard: logica di determinazione, in quale situazione siamo?
 */
const SessionGuard = () => {
  const location = useLocation();
  const isInitialized = useAppSelector((state: RootState) => state.appState.isInitialized);
  const { sessionToken, exp: expDate } = useAppSelector((state: RootState) => state.userState.user);
  const { isClosedSession, tos } = useAppSelector((state: RootState) => state.userState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));

  // vedi il commentone in useProcess
  const { isFinished, performStep } = useProcess(INITIALIZATION_SEQUENCE);

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
      // se i dati del utente sono stati presi da session storage,
      // si deve saltare la user determination e settare l'indicativo di session reload
      // che verrà usato nella initial page determination
      if (sessionToken) {
        setIsSessionReload(true);
      } else {
        const spidToken = getTokenParam();
        if (spidToken) {
          await dispatch(exchangeToken(spidToken));
        }
      }
    };
    void performStep(INITIALIZATION_STEPS.USER_DETERMINATION, doUserDetermination);
  }, [performStep]);

  /**
   * Step 2 - ottenere TOS status
   * NB: questo l'ho definito in uno step separato, per essere sicuro che nello step successivo
   *     l'attributo tos dello store sia settato.
   *     Avevo fatto un'altra implementazione nella cui si prendeva il risultato del dispatch,
   *     ma questo faceva andare alcuni tests in errore. Perciò ho adottato questa soluzione.
   */
  useEffect(() => {
    const doFetchTOSStatus = async () => {
      // l'analisi delle TOS ha senso solo se c'è un utente
      if (sessionToken && !isClosedSession) {
        await dispatch(getToSApproval());
      }
    };
    void performStep(INITIALIZATION_STEPS.FETCH_TOS_STATUS, doFetchTOSStatus);
  }, [performStep]);

  /**
   * Step 3 - determinazione pagina iniziale
   */
  useEffect(() => {
    const doInitalPageDetermination = async () => {
      // l'analisi delle TOS ha senso solo se c'è un utente
      if (sessionToken && !isClosedSession) {
        // non si setta initial page se è un session reload di un utente che ha già accettato i TOS
        const initialPage = tos ? (isSessionReload ? undefined : routes.NOTIFICHE) : routes.TOS;
        if (initialPage) {
          navigate(initialPage, { replace: true });
        }
      }
    };
    void performStep(INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION, doInitalPageDetermination);
  }, [performStep]);

  /**
   * Step 4 - lancio del sessionCheck
   */
  useEffect(() => {
    void performStep(INITIALIZATION_STEPS.SESSION_CHECK, () => {
      if (sessionToken && !isClosedSession) {
        sessionCheck(expDate);
      }
    });
  }, [performStep]);

  /**
   * Fine processo inizializzazione
   */
  useEffect(() => {
    if (!isInitialized && isFinished()) {
      dispatch(appStateActions.finishInitialization());
    }
  }, [isInitialized, isFinished]);

  return <SessionGuardRender />;
};

export default SessionGuard;
