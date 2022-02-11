import { LoadingOverlay, Layout } from '@pagopa-pn/pn-commons';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SideMenu from './components/SideMenu/SideMenu';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { RootState } from './redux/store';

const App = () => {
  const token = useSelector((state: RootState) => state.userState.user.sessionToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token !== '') {
      navigate('/dashboard');
    }
  }, [token]);

  return (
    <Layout
      assistanceEmail={process.env.REACT_APP_PAGOPA_HELP_EMAIL}
      onExitAction={() => dispatch(logout())}
      sideMenu={<SideMenu/>}
    >
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};
export default App;
