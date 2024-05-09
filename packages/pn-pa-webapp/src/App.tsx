import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Email from '@mui/icons-material/Email';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import StatisticsIcon from '@mui/icons-material/ShowChart';
import VpnKey from '@mui/icons-material/VpnKey';
import { Box } from '@mui/material';
import {
  AppMessage,
  AppResponseMessage,
  Layout,
  LoadingOverlay,
  ResponseEventDispatcher,
  SideMenu,
  SideMenuItem,
  appStateActions,
  errorFactoryManager,
  initLocalization,
  useMultiEvent,
  useTracking,
} from '@pagopa-pn/pn-commons';
import { LinkType, ProductEntity } from '@pagopa/mui-italia';

import Router from './navigation/routes';
import * as routes from './navigation/routes.const';
import { getCurrentAppStatus } from './redux/appStatus/actions';
import { getInstitutions, getProductsOfInstitution, logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getConfiguration } from './services/configuration.service';
import { PAAppErrorFactory } from './utility/AppError/PAAppErrorFactory';
import './utility/onetrust';
import { getMenuItems } from './utility/role.utility';

// Cfr. PN-6096
// --------------------
// The i18n initialization must execute before the *first* time anything is actually rendered.
// Cfr. comment in packages/pn-personafisica-webapp/src/App.tsx
// --------------------
const App = () => {
  const { t } = useTranslation(['common', 'notifiche']);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      // init localization
      initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
      // eslint-disable-next-line functional/immutable-data
      errorFactoryManager.factory = new PAAppErrorFactory((path, ns) => t(path, { ns }));
    }
  }, [isInitialized]);

  return isInitialized ? <ActualApp /> : <div />;
};

const ActualApp = () => {
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const loggedUserOrganizationParty = loggedUser.organization;
  // TODO check if it can exist more than one role on user
  const role = loggedUserOrganizationParty?.roles[0];
  const idOrganization = loggedUserOrganizationParty?.id;
  const { tosConsent, privacyConsent } = useAppSelector((state: RootState) => state.userState);
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const { SELFCARE_BASE_URL, SELFCARE_SEND_PROD_ID, IS_STATISTICS_ENABLED } = getConfiguration();
  const products = useAppSelector((state: RootState) => state.userState.productsOfInstitution);
  const institutions = useAppSelector((state: RootState) => state.userState.institutions);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);

  const reservedArea: ProductEntity = {
    id: 'selfcare',
    title: t('header.reserved-area'),
    productUrl: `${SELFCARE_BASE_URL}/dashboard/${idOrganization}`,
    linkType: 'external',
  };

  const productsList =
    products.length > 0
      ? [reservedArea, ...products]
      : [
          reservedArea,
          {
            id: '0',
            title: t('header.notification-platform'),
            productUrl: '',
            linkType: 'internal' as LinkType,
          },
        ];
  const productId = products.length > 0 ? SELFCARE_SEND_PROD_ID : '0';
  const institutionsList =
    institutions.length > 0
      ? institutions.map((institution) => ({
          ...institution,
          productRole: t(`roles.${role.role}`),
        }))
      : [
          {
            id: idOrganization,
            name: loggedUserOrganizationParty.name,
            productRole: t(`roles.${role.role}`),
            parentName: loggedUserOrganizationParty?.rootParent?.description,
          },
        ];

  const sessionToken = loggedUser.sessionToken;

  const configuration = useMemo(() => getConfiguration(), []);

  const menuItems = useMemo(() => {
    const basicMenuItems: Array<SideMenuItem> = [
      { label: 'menu.notifications', icon: Email, route: routes.DASHBOARD },
      /**
       * Refers to PN-1741
       * Commented out because beyond MVP scope
       *
       * LINKED TO:
       * - "<Route path={routes.API_KEYS}.../>" in packages/pn-pa-webapp/src/navigation/routes.tsx
       * - BasicMenuItems in packages/pn-pa-webapp/src/utility/__TEST__/role.utilitytest.ts
       */
      { label: 'menu.api-key', icon: VpnKey, route: routes.API_KEYS },
      {
        label: 'menu.app-status',
        // ATTENTION - a similar logic to choose the icon and its color is implemented in AppStatusBar (in pn-commons)
        icon: () =>
          currentStatus ? (
            currentStatus.appIsFullyOperative ? (
              <CheckCircleIcon sx={{ color: 'success.main' }} />
            ) : (
              <ErrorIcon sx={{ color: 'error.main' }} />
            )
          ) : (
            <HelpIcon />
          ),
        route: routes.APP_STATUS,
      },
    ];

    // As the basicMenuItems definition now accesses the MUI theme and the Redux store,
    // it would be cumbersome to include it in a "raw" (i.e. not linked to React) function.
    // I preferred to define the basicMenuItems in the App React component,
    // and pass them to the getMenuItems function, which just decides whether to include the selfCareItems or not.
    // In turn, as basicMenuItems is defined in the React component, the definition can also access
    // the i18n mechanism, so that is no longer needed to localize the labels afterwards.
    // -------------------------------
    // Carlos Lombardi, 2022.11.08
    // -------------------------------

    // TODO fix positioning for this item PN-10851
    if (IS_STATISTICS_ENABLED) {
      // eslint-disable-next-line functional/immutable-data
      basicMenuItems.splice(1, 0, {
        label: 'menu.statistics',
        icon: StatisticsIcon,
        route: routes.STATISTICHE,
      });
    }
    const items = { ...getMenuItems(basicMenuItems, idOrganization, role?.role) };
    // localize menu items
    /* eslint-disable-next-line functional/immutable-data */
    items.menuItems = items.menuItems.map((item) => ({ ...item, label: t(item.label) }));
    if (items.selfCareItems) {
      /* eslint-disable-next-line functional/immutable-data */
      items.selfCareItems = items.selfCareItems.map((item) => ({ ...item, label: t(item.label) }));
    }
    return items;
  }, [role, idOrganization, currentStatus, i18n.language]);

  const jwtUser = useMemo(
    () => ({
      id: loggedUser.fiscal_number,
      name: loggedUser.name,
      surname: loggedUser.family_name,
    }),
    [loggedUser]
  );

  useTracking(configuration.MIXPANEL_TOKEN, process.env.NODE_ENV);

  useEffect(() => {
    if (sessionToken) {
      void dispatch(getCurrentAppStatus());
      void dispatch(getInstitutions());
    }
    if (idOrganization) {
      void dispatch(getProductsOfInstitution(idOrganization));
    }
  }, [sessionToken, getCurrentAppStatus, idOrganization]);

  const { pathname } = useLocation();
  const path = pathname.split('/');
  const isPrivacyPage = path[1] === 'privacy-tos';

  const handleLogout = () => {
    void dispatch(logout());
  };

  const handleAssistanceClick = () => {
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = sessionToken
      ? `${SELFCARE_BASE_URL}/assistenza?productId=${productId}`
      : `mailto:${configuration.PAGOPA_HELP_EMAIL}`;
  };

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  const [clickVersion] = useMultiEvent({
    callback: () =>
      dispatch(
        appStateActions.addSuccess({
          title: 'Current version',
          message: `v${configuration.APP_VERSION}`,
        })
      ),
  });

  return (
    <>
      <ResponseEventDispatcher />
      <Layout
        showHeader={!isPrivacyPage}
        showFooter={!isPrivacyPage}
        onExitAction={handleLogout}
        sideMenu={
          role &&
          menuItems && (
            <SideMenu menuItems={menuItems.menuItems} selfCareItems={menuItems.selfCareItems} />
          )
        }
        showSideMenu={
          !!sessionToken &&
          tosConsent &&
          tosConsent.accepted &&
          privacyConsent &&
          privacyConsent.accepted &&
          !isPrivacyPage
        }
        productsList={productsList}
        productId={productId}
        partyId={idOrganization}
        partyList={institutionsList}
        loggedUser={jwtUser}
        onLanguageChanged={changeLanguageHandler}
        onAssistanceClick={handleAssistanceClick}
        isLogged={!!sessionToken}
      >
        <AppMessage />
        <AppResponseMessage />
        <LoadingOverlay />
        <Router />
      </Layout>
      <Box onClick={clickVersion} sx={{ height: '5px', background: 'white' }}></Box>
    </>
  );
};
export default App;
