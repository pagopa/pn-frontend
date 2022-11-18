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
import { Outlet, useLocation } from 'react-router-dom';
import { AUTH_ACTIONS, exchangeToken, logout } from '../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { DISABLE_INACTIVITY_HANDLER } from '../utils/constants';
import { goToSelfcareLogin } from './navigation.utility';

enum INITIALIZATION_STEPS {
  USER_DETERMINATION = 'UserDetermination',
  SESSION_CHECK = 'SessionCheck',
}

const INITIALIZATION_SEQUENCE = [
  INITIALIZATION_STEPS.USER_DETERMINATION,
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
  const sessionCheck = useSessionCheck(200, () => dispatch(logout()));
  const { hasApiErrors } = useErrors();

  const { isFinished, performStep } = useProcess(INITIALIZATION_SEQUENCE);

  const hasTosApiErrors = hasApiErrors(AUTH_ACTIONS.GET_TOS_APPROVAL);

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
      if (!sessionToken)  {
        const spidToken = getTokenParam();
        if (spidToken) {
          await dispatch(exchangeToken(spidToken));
        }
      }
    };
    void performStep(INITIALIZATION_STEPS.USER_DETERMINATION, doUserDetermination);
  }, [performStep, getTokenParam, sessionToken]);

  /**
   * Step 2 - lancio del sessionCheck
   */
  useEffect(() => {
    void performStep(INITIALIZATION_STEPS.SESSION_CHECK, () => {
      if (sessionToken && !isClosedSession && !hasTosApiErrors) {
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
