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
import { exchangeToken, logout } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { DISABLE_INACTIVITY_HANDLER } from '../utils/constants';
import { getHomePage } from '../utils/role.utility';
import { goToSelfcareLogin } from './navigation.utility';

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

const inactivityTimer = 5 * 60 * 1000;

// riguardo alla definizione di due componenti separati,
// cfr. il commento in merito nel file SessionGuard.tsx in pn-personafisica-webapp

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
        handleClose={goToSelfcareLogin}
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

const SessionGuard = () => {
  const location = useLocation();
  const isInitialized = useAppSelector((state: RootState) => state.appState.isInitialized);
  const { sessionToken, desired_exp: expDate } = useAppSelector(
    (state: RootState) => state.userState.user
  );
  const { isClosedSession } = useAppSelector((state: RootState) => state.userState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));

  const { isFinished, performStep } = useProcess(INITIALIZATION_SEQUENCE);

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
        setIsSessionReload(true);
      } else {
        const selfCareToken = getTokenParam();
        if (selfCareToken) {
          await dispatch(exchangeToken(selfCareToken));
        }
      }
    };
    void performStep(INITIALIZATION_STEPS.USER_DETERMINATION, doUserDetermination);
  }, [performStep, getTokenParam, sessionToken]);

  /**
   * Step 2 - determinazione pagina iniziale
   */
  useEffect(() => {
    const doInitalPageDetermination = async () => {
      // non si setta initial page se è un session reload
      if (sessionToken && !isClosedSession && !isSessionReload) {
        navigate(getHomePage(), { replace: true });
      }
    };
    void performStep(INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION, doInitalPageDetermination);
  }, [performStep, sessionToken, isClosedSession, isSessionReload]);

  /**
   * Step 3 - lancio del sessionCheck
   */
  useEffect(() => {
    void performStep(INITIALIZATION_STEPS.SESSION_CHECK, () => {
      if (sessionToken && !isClosedSession) {
        sessionCheck(expDate);
      }
    });
  }, [performStep, sessionToken, isClosedSession]);

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
