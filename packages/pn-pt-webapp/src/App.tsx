import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InstitutionsIcon from '@mui/icons-material/AccountBalanceOutlined';
import { DialogTitle } from '@mui/material';
import {
  AppMessage,
  AppResponseMessage,
  Layout,
  PnDialog,
  PnDialogActions,
  ResponseEventDispatcher,
  SideMenu,
  SideMenuItem,
  initLocalization,
  initLocalizationExists,
} from '@pagopa-pn/pn-commons';
import { MIButton, PartyEntity } from '@pagopa/mui-italia';

import { PNRole } from './models/user';
import { goToSelfcareLogout } from './navigation/navigation.utility';
import Router from './navigation/routes';
import * as routes from './navigation/routes.const';
import { apiLogout } from './redux/auth/actions';
import { authSelectors, resetState } from './redux/auth/reducers';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getConfiguration } from './services/configuration.service';
import { getProductsList, selfcareMenuItems } from './utility/menu.utility';

// TODO - Read this from /products API
const PRODUCT_ID = 'prod-pn-pt';

const App = () => {
  const { t, i18n } = useTranslation(['common']);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      // init localization
      initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
      initLocalizationExists((namespace, path) => i18n.exists(path, { ns: namespace }));
    }
  }, [isInitialized]);

  return isInitialized ? <ActualApp /> : <div />;
};

const ActualApp = () => {
  const { t, i18n } = useTranslation(['common']);
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(authSelectors.selectUser);
  const role = useAppSelector(authSelectors.selectUserRole);
  const { ACCESSIBILITY_LINK, SERCQ_SERVICE_STATEMENT_LINK, PAGOPA_HELP_EMAIL } =
    getConfiguration();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { sessionToken, organization } = loggedUser;

  const jwtUser = useMemo(
    () => ({
      id: loggedUser.fiscal_number ?? loggedUser.uid,
      name: loggedUser.name,
      surname: loggedUser.family_name,
    }),
    [loggedUser]
  );

  // the PT user belongs to a single party and can't switch to another one:
  // with only one party, the header shows it without the party switch
  const party: PartyEntity = useMemo(
    () => ({
      id: organization.id,
      name: organization.name,
      productRole: role ? t(`roles.${role}`) : '',
      logoUrl: undefined,
    }),
    [organization, role, i18n.language]
  );

  const menuItems: Array<SideMenuItem> = useMemo(
    () => [{ label: t('menu.institutions'), icon: InstitutionsIcon, route: routes.HOME }],
    [i18n.language]
  );

  // like PA, SelfCare menu items are shown only to admin users
  const selfCareItems: Array<SideMenuItem> | undefined = useMemo(
    () =>
      role === PNRole.ADMIN
        ? selfcareMenuItems(organization.id, i18n.language).map((item) => ({
            ...item,
            label: t(item.label),
          }))
        : undefined,
    [role, organization.id, i18n.language]
  );

  const productsList = useMemo(
    () => getProductsList(t, PRODUCT_ID, organization.id, i18n.language),
    [organization.id, i18n.language]
  );

  const handleAssistanceClick = () => {
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  const handleLogout = () => {
    setIsDeleteModalOpen(true);
  };

  const performLogout = async () => {
    await dispatch(apiLogout(sessionToken));
    dispatch(resetState());
    goToSelfcareLogout();
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <ResponseEventDispatcher />
      <Layout
        onExitAction={handleLogout}
        sideMenu={<SideMenu menuItems={menuItems} selfCareItems={selfCareItems} />}
        showSideMenu={!!sessionToken}
        productsList={productsList}
        productId={PRODUCT_ID}
        partyId={party.id}
        partyList={[party]}
        loggedUser={jwtUser}
        currentLanguage={i18n.language}
        onLanguageChanged={changeLanguageHandler}
        onAssistanceClick={handleAssistanceClick}
        isLogged={!!sessionToken}
        accessibilityLink={ACCESSIBILITY_LINK}
        sercqServiceStatementLink={SERCQ_SERVICE_STATEMENT_LINK}
      >
        <PnDialog open={isDeleteModalOpen}>
          <DialogTitle sx={{ mb: 2 }}>{t('header.logout-message')}</DialogTitle>
          <PnDialogActions>
            <MIButton
              id="cancelButton"
              variant="outlined"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t('button.annulla')}
            </MIButton>
            <MIButton data-testid="confirm-button" variant="contained" onClick={performLogout}>
              {t('header.logout')}
            </MIButton>
          </PnDialogActions>
        </PnDialog>
        <AppMessage />
        <AppResponseMessage />
        <Router />
      </Layout>
    </>
  );
};

export default App;
