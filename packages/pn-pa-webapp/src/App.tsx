import { LoadingOverlay, Layout, AppMessage, SideMenu } from '@pagopa-pn/pn-commons';

import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getMenuItems } from './utils/role.utility';
import { PAGOPA_HELP_EMAIL } from './utils/constants';

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
      <AppMessage />
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};
export default App;
