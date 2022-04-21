import { LoadingOverlay, Layout, AppMessage, SideMenu } from '@pagopa-pn/pn-commons';

import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getMenuItems } from './utils/role.utility';
import { PAGOPA_HELP_EMAIL, SELFCARE_URL_FE_LOGIN } from './utils/constants';

const App = () => {
  const role = useAppSelector((state: RootState) => state.userState.user.organization?.role);
  const idOrganization = useAppSelector(
    (state: RootState) => state.userState.user.organization?.id
  );

  const dispatch = useAppDispatch();

  const menuItems = getMenuItems(role, idOrganization);

  return (
    <Layout
      assistanceEmail={PAGOPA_HELP_EMAIL}
      onExitAction={() => dispatch(logout())}
      sideMenu={
        role && <SideMenu menuItems={menuItems.menuItems} selfCareItems={menuItems.selfCareItems} />
      }
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
