import { LoadingOverlay, Layout } from '@pagopa-pn/pn-commons';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Router from './navigation/routes';
import { RootState } from './redux/store';

const App = () => {
  const token = useSelector((state: RootState) => state.userState.user.sessionToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (token !== '') {
      navigate('/dashboard');
    }
  }, [token]);

  return (
    <Layout assistanceEmail={process.env.REACT_APP_PAGOPA_HELP_EMAIL}>
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};
export default App;
