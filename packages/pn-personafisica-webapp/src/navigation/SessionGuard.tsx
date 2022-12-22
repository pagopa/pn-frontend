import {
  appStateActions,
  InactivityHandler,
  SessionModal,
  useErrors,
  useProcess,
  useSessionCheck,
} from '@pagopa-pn/pn-commons';
import { Fragment, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AUTH_ACTIONS, exchangeToken, logout } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { DISABLE_INACTIVITY_HANDLER } from '../utils/constants';
import { goToLoginPortal } from './navigation.utility';
import * as routes from './routes.const';

enum INITIALIZATION_STEPS {
  USER_DETERMINATION = 'UserDetermination',
  INITIAL_PAGE_DETERMINATION = 'InitialPageDetermination',
  SESSION_CHECK = 'SessionCheck',
}

const INITIALIZATION_SEQUENCE = [
  INITIALIZATION_STEPS.USER_DETERMINATION,
  INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION,
  INITIALIZATION_STEPS.SESSION_CHECK,
];

const inactivityTimer = 20 * 1000;  //  5 * 60 * 1000;

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
  const { hasApiErrors } = useErrors();

  const isAnonymousUser = !isUnauthorizedUser && !sessionToken;
  const hasTosApiErrors = hasApiErrors(AUTH_ACTIONS.GET_TOS_APPROVAL);

  const goodbyeMessage = {
    title: isUnauthorizedUser ? messageUnauthorizedUser.title : 
      hasTosApiErrors ? t('error-when-fetching-tos-status.title') : t('leaving-app.title'),
    message: isUnauthorizedUser ? messageUnauthorizedUser.message : 
      hasTosApiErrors ? t('error-when-fetching-tos-status.message') : t('leaving-app.message'),
  };

  const renderIfInitialized = () =>
    isUnauthorizedUser || hasTosApiErrors || isClosedSession ? (
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
  const { isClosedSession } = useAppSelector((state: RootState) => state.userState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));
  const { hasApiErrors } = useErrors();

  // vedi il commentone in useProcess
  const { isFinished, performStep } = useProcess(INITIALIZATION_SEQUENCE);

  const hasTosApiErrors = hasApiErrors(AUTH_ACTIONS.GET_TOS_APPROVAL);

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
      if (!sessionToken)  {
        const spidToken = getTokenParam();
        if (spidToken) {
          await dispatch(exchangeToken(spidToken));
        }
      }
    };
    void performStep(INITIALIZATION_STEPS.USER_DETERMINATION, doUserDetermination);
  }, [performStep]);

  /**
   * Step 2 - determinazione pagina iniziale
   */
  useEffect(() => {
    const doInitalPageDetermination = async () => {
      if (sessionToken && !isClosedSession && !hasTosApiErrors) {
        // se non è presente una route diversa dalla root si viene reindirizzati alla dashboard delle notifiche
        const rootPath = location.pathname === '/';
        if (rootPath) {
          navigate(routes.NOTIFICHE, { replace: true });
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
      if (sessionToken && !isClosedSession && !hasTosApiErrors) {
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
