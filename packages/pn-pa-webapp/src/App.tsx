import { LoadingOverlay, Layout, AppMessage, SideMenu } from '@pagopa-pn/pn-commons';

import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getMenuItems } from './utils/role.utility';
import { PAGOPA_HELP_EMAIL, SELFCARE_URL_FE_LOGIN, SELFCARE_BASE_URL } from './utils/constants';

// TODO: get products list from be (?)
const productsList = [
  {
    id: "0",
    title: `Piattaforma Notifiche`,
    productUrl: "",
  },
  {
    id: "1",
    title: `Area Riservata`,
    productUrl: SELFCARE_BASE_URL as string,
  }
];

// TODO: get parties list from be (?)
const partyList = [
  {
    id: "0",
    name: `Comune di Milano`,
    productRole: 'Referente amministrativo',
    logoUrl: `https://assets.cdn.io.italia.it/logos/organizations/1199250158.png`
  }
];

const App = () => {
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const dispatch = useAppDispatch();

  const role = loggedUser.organization?.role;
  const idOrganization = loggedUser.organization?.id;
  const menuItems = getMenuItems(role, idOrganization);
  const jwtUser = {
    id: loggedUser.fiscal_number,
    name: loggedUser.name,
    surname: loggedUser.family_name
  };

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
