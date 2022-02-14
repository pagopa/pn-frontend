import { LoadingOverlay, Layout } from '@pagopa-pn/pn-commons';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SideMenu from './components/SideMenu/SideMenu';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { RootState } from './redux/store';
import { getHomePage, getMenuItems } from './utils/role.utility';

const App = () => {
  const token = useSelector((state: RootState) => state.userState.user.sessionToken);
  const role = useSelector((state: RootState) => state.userState.user.organization?.role);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};
export default App;
