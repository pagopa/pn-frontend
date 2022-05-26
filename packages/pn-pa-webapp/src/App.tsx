import { useEffect, useMemo } from 'react';
import { LoadingOverlay, Layout, AppMessage, SideMenu } from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductSwitchItem } from '@pagopa/mui-italia';

import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getMenuItems } from './utils/role.utility';
import { PAGOPA_HELP_EMAIL, SELFCARE_URL_FE_LOGIN, SELFCARE_BASE_URL } from './utils/constants';
import { mixpanelInit } from './utils/mixpanel';

// TODO: get products list from be (?)
const productsList: Array<ProductSwitchItem> = [
  {
    id: '0',
    title: `Piattaforma Notifiche`,
    productUrl: '',
    linkType: 'internal',
  },
  {
    id: '1',
    title: `Area Riservata`,
    productUrl: SELFCARE_BASE_URL as string,
    linkType: 'external',
  },
];

// TODO: get parties list from be (?)
const partyList: Array<PartyEntity> = [
  {
    id: '0',
    name: `Comune di Milano`,
    productRole: 'Referente amministrativo',
    logoUrl: `https://assets.cdn.io.italia.it/logos/organizations/1199250158.png`,
  },
];

const App = () => {
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const dispatch = useAppDispatch();

  // TODO check if it can exist more than one role on user
  const role = loggedUser.organization?.roles[0];
  const idOrganization = loggedUser.organization?.id;
  const menuItems = useMemo(() => getMenuItems(role.partyRole, idOrganization), [role, idOrganization]);
  const jwtUser = useMemo(
    () => ({
      id: loggedUser.fiscal_number,
      name: loggedUser.name,
      surname: loggedUser.family_name,
    }),
    [loggedUser]
  );

  useEffect(() => {
    // init mixpanel
    mixpanelInit();
  }, []);

  return (
    <Layout
      onExitAction={() => dispatch(logout())}
      sideMenu={
        role && <SideMenu menuItems={menuItems.menuItems} selfCareItems={menuItems.selfCareItems} />
      }
      assistanceEmail={PAGOPA_HELP_EMAIL}
      productsList={productsList}
      partyList={partyList}
      loggedUser={jwtUser}
    >
      <AppMessage
        sessionRedirect={() => {
          /* eslint-disable-next-line functional/immutable-data */
          window.location.href = SELFCARE_URL_FE_LOGIN as string;
        }}
      />
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};
export default App;
