import { LoadingOverlay, Layout } from '@pagopa-pn/pn-commons';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch } from './redux/hooks';

const App = () => {
  const dispatch = useAppDispatch();
  return (
    <Layout
      onExitAction={() => dispatch(logout())}
      assistanceEmail={process.env.REACT_APP_PAGOPA_HELP_EMAIL}
    >
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};

export default App;
