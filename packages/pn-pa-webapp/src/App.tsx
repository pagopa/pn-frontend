import { ErrorInfo, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppMessage,
  appStateActions,
  initLocalization,
  Layout,
  LoadingOverlay,
  SideMenu,
  useMultiEvent,
  useTracking,
  useUnload,
} from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductSwitchItem } from '@pagopa/mui-italia';
import { Box } from '@mui/material';

import { MIXPANEL_TOKEN } from "./utils/constants";
import Router from './navigation/routes';
import { getOrganizationParty, logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getMenuItems } from './utils/role.utility';

import { PAGOPA_HELP_EMAIL, SELFCARE_BASE_URL, VERSION } from './utils/constants';
import { trackEventByType } from './utils/mixpanel';
import { TrackEventType } from './utils/events';
import './utils/onetrust';

const App = () => {
  useUnload(() => {
    trackEventByType(TrackEventType.APP_UNLOAD);
  });

  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const loggedUserOrganizationParty = useAppSelector(
    (state: RootState) => state.userState.organizationParty
  );
  const { tos } = useAppSelector((state: RootState) => state.userState);

  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);

  // TODO check if it can exist more than one role on user
  const role = loggedUser.organization?.roles[0];
  const idOrganization = loggedUser.organization?.id;
  const sessionToken = loggedUser.sessionToken;
  const menuItems = useMemo(() => {
    // localize menu items
    const items = { ...getMenuItems(idOrganization, role?.role) };
    /* eslint-disable-next-line functional/immutable-data */
    items.menuItems = items.menuItems.map((item) => ({ ...item, label: t(item.label) }));
    if (items.selfCareItems) {
      /* eslint-disable-next-line functional/immutable-data */
      items.selfCareItems = items.selfCareItems.map((item) => ({ ...item, label: t(item.label) }));
    }
    return items;
  }, [role, idOrganization]);
  const jwtUser = useMemo(
    () => ({
      id: loggedUser.fiscal_number,
      name: loggedUser.name,
      surname: loggedUser.family_name,
    }),
    [loggedUser]
  );

  // TODO: get products list from be (?)
  const productsList: Array<ProductSwitchItem> = useMemo(
    () => [
      {
        id: '1',
        title: t('header.reserved-area'),
        productUrl: `${SELFCARE_BASE_URL as string}/dashboard/${idOrganization}`,
        linkType: 'external',
      },
      {
        id: '0',
        title: t('header.notification-platform'),
        productUrl: '',
        linkType: 'internal',
      },
    ],
    [idOrganization]
  );

  const partyList: Array<PartyEntity> = useMemo(
    () => [
      {
        id: '0',
        name: loggedUserOrganizationParty.name,
        // productRole: role?.role,
        productRole: t(`roles.${role?.role}`),
        logoUrl: undefined,
        // non posso settare un'icona di MUI perché @pagopa/mui-italia accetta solo string o undefined come logoUrl
        // ma fortunatamente, se si passa undefined, fa vedere proprio il logo che ci serve
        // ------------------
        // Carlos Lombardi, 2022.07.28
        // logoUrl: <AccountBalanceIcon />
      },
    ],
    [role, loggedUserOrganizationParty]
  );

  useEffect(() => {
    // init localization
    initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
  }, []);

  useTracking(MIXPANEL_TOKEN, process.env.NODE_ENV);

  useEffect(() => {
    if (idOrganization) {
      void dispatch(getOrganizationParty(idOrganization));
    }
  }, [idOrganization]);

  const { pathname } = useLocation();
  const path = pathname.split('/');
  const source = path[path.length - 1];
  const isPrivacyPage = path[1] === 'privacy-tos';

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

  const handleLogout = () => {
    void dispatch(logout());
  };

  const handleAssistanceClick = () => {
    trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO, { source: 'postlogin' });
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
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
        showHeader={!isPrivacyPage}
        showFooter={!isPrivacyPage}
        onExitAction={handleLogout}
        eventTrackingCallbackAppCrash={handleEventTrackingCallbackAppCrash}
        eventTrackingCallbackFooterChangeLanguage={handleEventTrackingCallbackFooterChangeLanguage}
        eventTrackingCallbackProductSwitch={(target: string) =>
          handleEventTrackingCallbackProductSwitch(target)
        }
        sideMenu={
          role &&
          menuItems && (
            <SideMenu
              menuItems={menuItems.menuItems}
              selfCareItems={menuItems.selfCareItems}
              eventTrackingCallback={(target: string) =>
                trackEventByType(TrackEventType.USER_NAV_ITEM, { target })
              }
            />
          )
        }
        showSideMenu={!!sessionToken && tos && !isPrivacyPage}
        productsList={productsList}
        productId={'0'}
        partyList={partyList}
        loggedUser={jwtUser}
        onLanguageChanged={changeLanguageHandler}
        onAssistanceClick={handleAssistanceClick}
        isLogged={!!sessionToken}
        hasTermsOfService={true}
      >
        <AppMessage sessionRedirect={handleLogout} />
        <LoadingOverlay />
        <Router />
      </Layout>
      <Box onClick={clickVersion} sx={{ height: '5px', background: 'white' }}></Box>
    </>
  );
};
export default App;
