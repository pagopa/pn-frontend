import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay, Layout, AppMessage} from '@pagopa-pn/pn-commons';

import SideMenu from './components/SideMenu/SideMenu';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getHomePage, getMenuItems } from './utils/role.utility';

const App = () => {
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const role = useAppSelector((state: RootState) => state.userState.user.organization?.role);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token !== '') {
      navigate(getHomePage(role));
    }
  }, [token, role]);

  return (
    <Layout
      assistanceEmail={process.env.REACT_APP_PAGOPA_HELP_EMAIL}
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
