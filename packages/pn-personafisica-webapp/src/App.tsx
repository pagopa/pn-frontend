import { LoadingOverlay, Layout } from '@pagopa-pn/pn-commons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { PAGOPA_HELP_EMAIL } from './utils/constants';

const App = () => {
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (token !== '') {
      navigate('/notifiche');
    }
  }, [token]);

  return (
    <Layout
      onExitAction={() => dispatch(logout())}
      assistanceEmail={PAGOPA_HELP_EMAIL}
    >
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};

export default App;
