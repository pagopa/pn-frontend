// import { useCallback, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// import {
//   AppResponsePublisher,
//   InactivityHandler,
//   LoadingPage,
//   SessionModal,
//   appStateActions,
//   useErrors,
//   useProcess,
//   useSessionCheck,
// } from '@pagopa-pn/pn-commons';

// import { useRapidAccessParam } from '../hooks/useRapidAccessParam';
// import { AUTH_ACTIONS, exchangeToken, logout } from '../redux/auth/actions';
// import { useAppDispatch, useAppSelector } from '../redux/hooks';
// import { RootState } from '../redux/store';
// import { getConfiguration } from '../services/configuration.service';
// import { goToLoginPortal } from './navigation.utility';
// import * as routes from './routes.const';

// enum INITIALIZATION_STEPS {
//   USER_DETERMINATION = 'UserDetermination',
//   INITIAL_PAGE_DETERMINATION = 'InitialPageDetermination',
//   SESSION_CHECK = 'SessionCheck',
// }

// const INITIALIZATION_SEQUENCE = [
//   INITIALIZATION_STEPS.USER_DETERMINATION,
//   INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION,
//   INITIALIZATION_STEPS.SESSION_CHECK,
// ];

// const inactivityTimer = 5 * 60 * 1000;

// const manageUnforbiddenError = (e: any) => {
//   if (e.status === 451) {
//     // error toast must not be shown
//     return false;
//   }
//   return true;
// };

// // Perché ci sono due componenti.
// // Il codice in SessionGuard implementa i steps necessari per determinare se c'è sessione, se è utente abilitato, se è sessione anonima, ecc..
// // D'altra parte, SessionGuardRender implementa la logica di cosa si deve renderizzare,
// // con casi speciali per utente non abilitato e sessione chiusa, ed anche l'analisi dello InactivityHandler
// // -----------------------------
// // Carlos Lombardi, 2022.10.05

// /**
//  * SessionGuardRender: logica di renderizzazione
//  */
// const SessionGuardRender = () => {
//   const rapidAccess = useRapidAccessParam();
//   const { IS_INACTIVITY_HANDLER_ENABLED } = getConfiguration();

//   const isInitialized = useAppSelector((state: RootState) => state.appState.isInitialized);
//   const { sessionToken } = useAppSelector((state: RootState) => state.userState.user);
//   const { isUnauthorizedUser, messageUnauthorizedUser, isClosedSession } = useAppSelector(
//     (state: RootState) => state.userState
//   );
//   const { t } = useTranslation(['common']);
//   const { hasApiErrors } = useErrors();

//   const isAnonymousUser = !isUnauthorizedUser && !sessionToken;
//   const hasTosPrivacyApiErrors = hasApiErrors(AUTH_ACTIONS.GET_TOS_PRIVACY_APPROVAL);

//   const hasErrorMessage = {
//     title: hasTosPrivacyApiErrors
//       ? t('error-when-fetching-tos-status.title')
//       : t('leaving-app.title'),
//     message: hasTosPrivacyApiErrors
//       ? t('error-when-fetching-tos-status.message')
//       : t('leaving-app.message'),
//   };

//   const goodbyeMessage = {
//     title: isUnauthorizedUser ? messageUnauthorizedUser.title : hasErrorMessage.title,
//     message: isUnauthorizedUser ? messageUnauthorizedUser.message : hasErrorMessage.message,
//   };

//   const renderIfInitialized = () => {
//     if (isUnauthorizedUser || hasTosPrivacyApiErrors || isClosedSession) {
//       return (
//         <SessionModal
//           open
//           title={goodbyeMessage.title}
//           message={goodbyeMessage.message}
//           handleClose={() => goToLoginPortal()}
//           initTimeout
//         />
//       );
//     } else if (isAnonymousUser) {
//       goToLoginPortal(rapidAccess);
//       return <></>;
//     }
//     return (
//       <InactivityHandler
//         inactivityTimer={isAnonymousUser || !IS_INACTIVITY_HANDLER_ENABLED ? 0 : inactivityTimer}
//         onTimerExpired={() => {
//           sessionStorage.clear();
//           goToLoginPortal();
//         }}
//       >
//         <Outlet />
//       </InactivityHandler>
//     );
//   };

//   return isInitialized ? renderIfInitialized() : <LoadingPage renderType="whole" />;
// };

// /**
//  * SessionGuard: logica di determinazione, in quale situazione siamo?
//  */
// const SessionGuard = () => {
//   const location = useLocation();
//   const isInitialized = useAppSelector((state: RootState) => state.appState.isInitialized);
//   const { sessionToken, exp: expDate } = useAppSelector((state: RootState) => state.userState.user);
//   const { isClosedSession, isForbiddenUser } = useAppSelector(
//     (state: RootState) => state.userState
//   );
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const rapidAccess = useRapidAccessParam();
//   const sessionCheck = useSessionCheck(200, () => dispatch(logout()));
//   const { hasApiErrors, hasSpecificStatusError } = useErrors();
//   const { WORK_IN_PROGRESS } = getConfiguration();

//   // vedi il commentone in useProcess
//   const { isFinished, performStep } = useProcess(INITIALIZATION_SEQUENCE);

//   const hasTosPrivacyApiErrors = hasApiErrors(AUTH_ACTIONS.GET_TOS_PRIVACY_APPROVAL);
//   const hasAnyForbiddenError = hasSpecificStatusError(403);

//   const getTokenParam = useCallback(() => {
//     const params = new URLSearchParams(location.hash);
//     return params.get('#token');
//   }, [location]);

//   /**
//    * Step 1 - user determination - token exchange.
//    * The token is obtained from the #token element in the hash of the URL.
//    */
//   useEffect(() => {
//     const doUserDetermination = async () => {
//       // se i dati del utente sono stati presi da session storage,
//       // si deve saltare la user determination e settare l'indicativo di session reload
//       // che verrà usato nella initial page determination
//       // ----------------------
//       // When user leaves the application without logging out (clicking on a external link) and after returns with another user,
//       // the sessionStorage contains the information of the previous user and this cause a serious bug.
//       // So if a token is present in the url, I clear the sessionStorage and I'll do the new tokenExchange.
//       // Again, I strongly recommend to rethink the guard structure and functionality
//       // ----------------------
//       // Andrea Cimini, 2023.03.07
//       // ----------------------
//       const spidToken = getTokenParam();
//       if (spidToken) {
//         AppResponsePublisher.error.subscribe('exchangeToken', manageUnforbiddenError);
//         await dispatch(exchangeToken({ spidToken, rapidAccess }));
//       }
//     };
//     void performStep(INITIALIZATION_STEPS.USER_DETERMINATION, doUserDetermination);
//   }, [performStep]);

//   /**
//    * Step 2 - initial page determination
//    * - If the access request specifies anything different from the root path,
//    *   then the path and the search are preserved, while the hash is discarded.
//    *
//    *   Why is not convenient to preserve the hash:
//    *   in case of timeout-caused logout the full path is set as origin for portale-login, and then reused as the path
//    *   when portale-login re-launches this app.
//    *   If we don't clean the token, then the "old" token will appear in the URL after the re-login, in fact that URL
//    *   would include two #token, "old" and "new".
//    *   Cfr. PN-2913.
//    *   Besides this, I guess is nicer to show a "cleaner" value in the browser address bar, not including a token
//    *   which has been already used (in the previous step of this guard).
//    *
//    * - Otherwise, the user is redirected to the notification dashboard.
//    */
//   useEffect(() => {
//     const doInitalPageDetermination = async () => {
//       if (sessionToken && !isClosedSession && !hasTosPrivacyApiErrors && !isForbiddenUser) {
//         const rootPath = location.pathname === '/';
//         if (rootPath) {
//           // ----------------------
//           // I'm not sure about this manual redirect because react-router-dom itself does redirect if properly configured
//           // For the moment and for aar link, I had to pass search: location.search in the navigate function
//           // Without it, the aar parameter was lost during redirect
//           // ----------------------
//           // Andrea Cimini, 2023.01.27
//           // ----------------------
//           navigate({ pathname: routes.NOTIFICHE, search: location.search }, { replace: true });
//         } else {
//           const hashAsObject = new URLSearchParams(location.hash);
//           hashAsObject.delete('#token');
//           // ----------------------
//           // Unfortunately, URLSearchParams does not preserve the # chars in the hash attribute names,
//           // hence I had to un-escape them.
//           // I don't know why replaceAll is not accepted by TS,
//           // maybe a problem wrt which version of JS/TS we should consider;
//           // for both this aspect and the implemented solution cfr.
//           // https://stackoverflow.com/questions/62825358/javascript-replaceall-is-not-a-function-type-error
//           // ----------------------
//           // Carlos Lombardi, 2022.12.27
//           // ----------------------
//           const newHash = hashAsObject.toString().replace(/%23/g, '#');
//           navigate(
//             { pathname: location.pathname, search: location.search, hash: newHash },
//             { replace: true }
//           );
//         }
//       } else if (isForbiddenUser || (!sessionToken && WORK_IN_PROGRESS)) {
//         // ----------------------
//         // I'm not sure about this management of the redirects
//         // Momentarily I have added the isForbiddenUser variable that is true if login returns 451 error code
//         // ----------------------
//         // Andrea Cimini, 2023.02.24
//         // ----------------------
//         navigate({ pathname: routes.NOT_ACCESSIBLE }, { replace: true });
//       }
//     };
//     void performStep(INITIALIZATION_STEPS.INITIAL_PAGE_DETERMINATION, doInitalPageDetermination);
//   }, [performStep]);

//   /**
//    * Step 3 - lancio del sessionCheck
//    */
//   useEffect(() => {
//     void performStep(INITIALIZATION_STEPS.SESSION_CHECK, () => {
//       if (sessionToken && !isClosedSession && !hasTosPrivacyApiErrors && !isForbiddenUser) {
//         sessionCheck(expDate);
//       }
//     });
//   }, [performStep]);

//   /**
//    * Fine processo inizializzazione
//    */
//   useEffect(() => {
//     if (!isInitialized && isFinished()) {
//       dispatch(appStateActions.finishInitialization());
//     }
//     return () => {
//       if (isInitialized) {
//         AppResponsePublisher.error.unsubscribe('exchangeToken', manageUnforbiddenError);
//       }
//     };
//   }, [isInitialized, isFinished]);

//   useEffect(() => {
//     if (hasAnyForbiddenError) {
//       void dispatch(logout());
//     }
//   }, [hasAnyForbiddenError]);

//   return <SessionGuardRender />;
// };

// export default SessionGuard;
