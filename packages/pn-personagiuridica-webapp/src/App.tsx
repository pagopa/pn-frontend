import { ErrorInfo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import {
  AppMessage,
  AppResponseMessage,
  appStateActions,
  initLocalization,
  Layout,
  SideMenu,
  SideMenuItem,
  useMultiEvent,
  useTracking,
  useUnload,
} from '@pagopa-pn/pn-commons';
import { ProductSwitchItem } from '@pagopa/mui-italia';
import { Email } from '@mui/icons-material';

import { useAppDispatch } from './redux/hooks';
import Router from './navigation/routes';
import { TrackEventType } from './utils/events';
import { trackEventByType } from './utils/mixpanel';
import { MIXPANEL_TOKEN, VERSION } from './utils/constants';
import * as routes from './navigation/routes.const';
import { getMenuItems } from './utils/role.utility';

// TODO: get products list from be (?)
const productsList: Array<ProductSwitchItem> = [
  {
    id: '0',
    title: `Piattaforma Notifiche`,
    productUrl: '',
    linkType: 'internal',
  },
];

function App() {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common']);
  const { pathname } = useLocation();
  const path = pathname.split('/');
  const source = path[path.length - 1];

  // TODO: remove mocked data
  const jwtUser = {
    id: 'FiscalCode',
    name: 'Name',
    surname: 'Surname',
    mail: 'mail',
  };

  // TODO: define side menu items
  const menuItems = useMemo(() => {
    const basicMenuItems: Array<SideMenuItem> = [
      { label: 'menu.notifications', icon: Email, route: routes.NOTIFICHE },
      // TODO: gestire badge
      {
        label: 'menu.delegations',
        icon: AltRouteIcon,
        route: routes.DELEGHE,
        rightBadgeNotification: undefined,
      },
    ];
    const items = { ...getMenuItems(basicMenuItems, 'id-organizazzione') };
    // localize menu items
    /* eslint-disable-next-line functional/immutable-data */
    items.menuItems = items.menuItems.map((item) => ({ ...item, label: t(item.label) }));
    if (items.selfCareItems) {
      /* eslint-disable-next-line functional/immutable-data */
      items.selfCareItems = items.selfCareItems.map((item) => ({ ...item, label: t(item.label) }));
    }
    return items;
  }, []);

  // TODO: manage tos
  const userActions = useMemo(() => {
    const profiloAction = {
      id: 'profile',
      label: t('menu.profilo'),
      onClick: () => {
        trackEventByType(TrackEventType.USER_VIEW_PROFILE);
        // TODO: navigate to profile page
      },
      icon: <SettingsIcon fontSize="small" color="inherit" />,
    };
    const logoutAction = {
      id: 'logout',
      label: t('header.logout'),
      onClick: () => handleUserLogout(),
      icon: <LogoutRoundedIcon fontSize="small" color="inherit" />,
    };
    return [profiloAction, logoutAction];
  }, []);

  const handleUserLogout = () => {
    // TODO: manage logout
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

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  const handleAssistanceClick = () => {
    trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO, { source: 'postlogin' });
    // TODO: manage assistance click
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

  useUnload(() => {
    trackEventByType(TrackEventType.APP_UNLOAD);
  });

  useTracking(MIXPANEL_TOKEN, process.env.NODE_ENV);

  useEffect(() => {
    // init localization
    initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
  }, []);

  return (
    <>
      <Layout
        eventTrackingCallbackAppCrash={handleEventTrackingCallbackAppCrash}
        eventTrackingCallbackFooterChangeLanguage={handleEventTrackingCallbackFooterChangeLanguage}
        eventTrackingCallbackProductSwitch={(target) =>
          handleEventTrackingCallbackProductSwitch(target)
        }
        loggedUser={jwtUser}
        enableUserDropdown
        productsList={productsList}
        sideMenu={
          menuItems && (
            <SideMenu
              menuItems={menuItems.menuItems}
              selfCareItems={menuItems.selfCareItems}
              eventTrackingCallback={(target) =>
                trackEventByType(TrackEventType.USER_NAV_ITEM, { target })
              }
            />
          )
        }
        userActions={userActions}
        onLanguageChanged={changeLanguageHandler}
        onAssistanceClick={handleAssistanceClick}
      >
        <AppMessage />
        <AppResponseMessage />
        <Router />
      </Layout>
      <Box onClick={clickVersion} sx={{ height: '5px', background: 'white' }}></Box>
    </>
  );
}

export default App;
