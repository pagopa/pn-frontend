import { LoadingOverlay, Layout, AppMessage} from '@pagopa-pn/pn-commons';

import SideMenu from './components/SideMenu/SideMenu';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getMenuItems } from './utils/role.utility';
import { PAGOPA_HELP_EMAIL } from './utils/constants';

const App = () => {
  const role = useAppSelector((state: RootState) => state.userState.user.organization?.role);
  const dispatch = useAppDispatch();

  return (
    <Layout
      assistanceEmail={PAGOPA_HELP_EMAIL}
      onExitAction={() => dispatch(logout())}
      sideMenu={role && <SideMenu menuItems={getMenuItems(role)} />}
    >
      <AppMessage />
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};
export default App;
