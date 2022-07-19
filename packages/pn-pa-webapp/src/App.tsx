import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LoadingOverlay,
  Layout,
  AppMessage,
  SideMenu,
  initLocalization,
} from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductSwitchItem } from '@pagopa/mui-italia';

import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getMenuItems } from './utils/role.utility';
import { PAGOPA_HELP_EMAIL, SELFCARE_BASE_URL, PARTY_MOCK } from './utils/constants';
import { mixpanelInit } from './utils/mixpanel';

const App = () => {
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);

  // TODO check if it can exist more than one role on user
  const role = loggedUser.organization?.roles[0];
  const idOrganization = loggedUser.organization?.id;
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

  // TODO: get parties list from be (?)
  const partyList: Array<PartyEntity> = useMemo(
    () => [
      {
        id: '0',
        name: PARTY_MOCK,
        productRole: role?.role,
        logoUrl: `https://assets.cdn.io.italia.it/logos/organizations/1199250158.png`,
      },
    ],
    [role]
  );

  useEffect(() => {
    // init localization
    initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
    // init mixpanel
    mixpanelInit();
  }, []);

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  return (
    <Layout
      onExitAction={() => dispatch(logout())}
      sideMenu={
        role &&
        menuItems && (
          <SideMenu menuItems={menuItems.menuItems} selfCareItems={menuItems.selfCareItems} />
        )
      }
      assistanceEmail={PAGOPA_HELP_EMAIL}
      productsList={productsList}
      productId={'0'}
      partyList={partyList}
      loggedUser={jwtUser}
      onLanguageChanged={changeLanguageHandler}
    >
      <AppMessage sessionRedirect={() => dispatch(logout())} />
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};
export default App;
