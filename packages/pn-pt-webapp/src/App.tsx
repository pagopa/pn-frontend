import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import { DialogTitle } from '@mui/material';
import {
  Layout,
  PnDialog,
  PnDialogActions,
  SideMenu,
  SideMenuItem,
  initLocalization,
  initLocalizationExists,
} from '@pagopa-pn/pn-commons';
import { JwtUser, MIButton } from '@pagopa/mui-italia';

import { institutionsDTO } from './__mocks__/User.mock';
import { AuthApi } from './api/auth/Auth.api';
import { goToSelfcareLogout } from './navigation/navigation.utility';
import Router from './navigation/routes';
import * as routes from './navigation/routes.const';
import { getConfiguration } from './services/configuration.service';
import { getProductsList, selfcareMenuItems } from './utility/menu.utility';

// MOCKED DATA (waiting for APIs)
const loggedUser: JwtUser = {
  id: '1',
  name: 'Partner',
  surname: 'Tecnologico',
  email: 'test@partner-tecnologico.it',
};

// TODO - Read this from token exchange API
const SESSION_TOKEN = '';

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
  const { ACCESSIBILITY_LINK, SERCQ_SERVICE_STATEMENT_LINK, PAGOPA_HELP_EMAIL } =
    getConfiguration();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const menuItems: Array<SideMenuItem> = useMemo(
    () => [{ label: t('menu.institutions'), icon: DnsOutlinedIcon, route: routes.HOME }],
    [i18n.language]
  );

  const selfCareItems: Array<SideMenuItem> = useMemo(
    () =>
      selfcareMenuItems(institutionsDTO.id, i18n.language).map((item) => ({
        ...item,
        label: t(item.label),
      })),
    [i18n.language]
  );

  const productsList = useMemo(
    () => getProductsList(t, PRODUCT_ID, institutionsDTO.id, i18n.language),
    [i18n.language]
  );

  const handleAssistanceClick = () => {
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  const handleLogout = () => {
    setIsDeleteModalOpen(true);
  };

  const performLogout = async () => {
    try {
      await AuthApi.logout(SESSION_TOKEN);
    } catch (e) {
      console.log('Error during logout', e);
    }
    goToSelfcareLogout();
    setIsDeleteModalOpen(false);
  };

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  return (
    <Layout
      onExitAction={handleLogout}
      sideMenu={<SideMenu menuItems={menuItems} selfCareItems={selfCareItems} />}
      productsList={productsList}
      productId={PRODUCT_ID}
      partyId={institutionsDTO.id}
      partyList={[institutionsDTO]}
      loggedUser={loggedUser}
      currentLanguage={i18n.language}
      onLanguageChanged={changeLanguageHandler}
      onAssistanceClick={handleAssistanceClick}
      isLogged
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
      <Router />
    </Layout>
  );
};

export default App;
