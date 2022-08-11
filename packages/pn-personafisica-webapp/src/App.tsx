import { ErrorInfo, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {
  AppMessage,
  appStateActions,
  initLocalization,
  Layout,
  LoadingOverlay,
  SideMenu,
  SideMenuItem,
  useMultiEvent,
  useUnload,
} from '@pagopa-pn/pn-commons';
import { ProductSwitchItem } from '@pagopa/mui-italia';
import { Box } from '@mui/material';

import * as routes from './navigation/routes.const';
import Router from './navigation/routes';
import { getToSApproval, logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { PAGOPA_HELP_EMAIL, VERSION } from './utils/constants';
import { RootState } from './redux/store';
import { Delegation } from './redux/delegation/types';
import { getDomicileInfo, getSidemenuInformation } from './redux/sidemenu/actions';
import { mixpanelInit, trackEventByType } from './utils/mixpanel';
import { TrackEventType } from './utils/events';
import './utils/onetrust';
import { goToLogin } from './navigation/navigation.utility';

declare const OneTrust: any;
declare const OnetrustActiveGroups: string;
const global = window as any;
// target cookies (Mixpanel)
const targCookiesGroup = 'C0004';

// TODO: get products list from be (?)
const productsList: Array<ProductSwitchItem> = [
  {
    id: '0',
    title: `Piattaforma Notifiche`,
    productUrl: '',
    linkType: 'internal',
  },
];

const App = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const { fetchedTos, tos } = useAppSelector((state: RootState) => state.userState);
  const { pendingDelegators, delegators } = useAppSelector(
    (state: RootState) => state.generalInfoState
  );
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.split('/');
  const source = path[path.length - 1];

  const sessionToken = loggedUser.sessionToken;
  const jwtUser = useMemo(
    () => ({
      id: loggedUser.fiscal_number,
      name: loggedUser.name,
      surname: loggedUser.family_name,
      mail: loggedUser.email,
    }),
    [loggedUser]
  );

  const userActions = useMemo(
    () => [
      {
        id: 'profile',
        label: t('menu.profilo'),
        onClick: () => {
          trackEventByType(TrackEventType.USER_VIEW_PROFILE);
          navigate(routes.PROFILO);
        },
        icon: <SettingsIcon fontSize="small" color="inherit" />,
      },
      {
        id: 'logout',
        label: t('header.logout'),
        onClick: () => {
          void dispatch(logout());
        },
        icon: <LogoutRoundedIcon fontSize="small" color="inherit" />,
      },
    ],
    []
  );

  useUnload(() => {
    trackEventByType(TrackEventType.APP_UNLOAD);
  });

  useEffect(() => {
    // init localization
    initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
    // OneTrust callback at first time
    // eslint-disable-next-line functional/immutable-data
    global.OptanonWrapper = function () {
      OneTrust.OnConsentChanged(function () {
        const activeGroups = OnetrustActiveGroups;
        if (activeGroups.indexOf(targCookiesGroup) > -1) {
          mixpanelInit();
        }
      });
    };
    // // check mixpanel cookie consent in cookie
    const OTCookieValue: string =
      document.cookie.split('; ').find((row) => row.startsWith('OptanonConsent=')) || '';
    const checkValue = `${targCookiesGroup}%3A1`;
    if (OTCookieValue.indexOf(checkValue) > -1) {
      mixpanelInit();
    }
  }, []);

  useEffect(() => {
    if (sessionToken !== '') {
      void dispatch(getDomicileInfo());
      void dispatch(getToSApproval());
    }
  }, [sessionToken]);

  useEffect(() => {
    if (sessionToken !== '') {
      void dispatch(getSidemenuInformation());
    }
  }, [pendingDelegators, sessionToken]);

  const mapDelegatorSideMenuItem = (): Array<SideMenuItem> | undefined => {
    if (delegators.length > 0) {
      const myNotifications = {
        label: t('title', { ns: 'notifiche' }),
        route: routes.NOTIFICHE,
      };
      const mappedDelegators = delegators.map((delegator: Delegation) => ({
        label:
          'delegator' in delegator && delegator.delegator
            ? `${delegator.delegator.displayName}`
            : 'No Name Found',
        route:
          'delegator' in delegator && delegator.delegator
            ? routes.GET_NOTIFICHE_DELEGATO_PATH(delegator.mandateId)
            : '*',
      }));
      return [myNotifications, ...mappedDelegators];
    } else {
      return undefined;
    }
  };

  const sideMenuDelegators = mapDelegatorSideMenuItem();

  // TODO spostare questo in un file di utility
  const menuItems: Array<SideMenuItem> = [
    {
      label: t('menu.notifiche'),
      icon: MailOutlineIcon,
      route: routes.NOTIFICHE,
      children: sideMenuDelegators,
      notSelectable: sideMenuDelegators && sideMenuDelegators.length > 0,
    },
    { label: t('menu.contacts'), icon: MarkunreadMailboxIcon, route: routes.RECAPITI },
    {
      label: t('menu.deleghe'),
      icon: AltRouteIcon,
      route: routes.DELEGHE,
      rightBadgeNotification: pendingDelegators ? pendingDelegators : undefined,
    },
  ];

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  const handleAssistanceClick = () => {
    trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO, { source: 'postlogin' });
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  const handleEventTrackingCallbackAppCrash = (e: Error, eInfo: ErrorInfo) => {
    trackEventByType(TrackEventType.APP_CRASH, {
      route: source,
      stacktrace: { error: e, errorInfo: eInfo },
    });
  };

  const handleEventTrackingCallbackFooterChangeLanguage = () => {
    trackEventByType(TrackEventType.FOOTER_LANG_SWITCH);
  };

  const handleEventTrackingCallbackProductSwitch = (target: string) => {
    trackEventByType(TrackEventType.USER_PRODUCT_SWITCH, { target });
  };

  const [clickVersion] = useMultiEvent({
    callback: () =>
      dispatch(
        appStateActions.addSuccess({
          title: 'Current version',
          message: `v${VERSION}`,
        })
      ),
  });

  return (
    <>
      <Layout
        onExitAction={() => dispatch(logout())}
        eventTrackingCallbackAppCrash={handleEventTrackingCallbackAppCrash}
        eventTrackingCallbackFooterChangeLanguage={handleEventTrackingCallbackFooterChangeLanguage}
        eventTrackingCallbackProductSwitch={(target) =>
          handleEventTrackingCallbackProductSwitch(target)
        }
        sideMenu={
          <SideMenu
            menuItems={menuItems}
            eventTrackingCallback={(target) =>
              trackEventByType(TrackEventType.USER_NAV_ITEM, { target })
            }
          />
        }
        showSideMenu={!fetchedTos || tos}
        productsList={productsList}
        loggedUser={jwtUser}
        enableUserDropdown
        userActions={userActions}
        onLanguageChanged={changeLanguageHandler}
        onAssistanceClick={handleAssistanceClick}
      >
        <AppMessage sessionRedirect={async () => { 
          if (sessionToken) {
            await dispatch(logout());
          } else {
            goToLogin();
          } 
        } } showConfirm={!!sessionToken} />
        <LoadingOverlay />
        <Router />
      </Layout>
      <Box onClick={clickVersion} sx={{ height: '5px', background: 'white' }}></Box>
    </>
  );
};

export default App;
