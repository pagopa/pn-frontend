import { LoadingOverlay, Layout } from '@pagopa-pn/pn-commons';
import Router from './navigation/routes';

const App = () => (
  <Layout assistanceEmail={process.env.REACT_APP_PAGOPA_HELP_EMAIL}>
    <LoadingOverlay />
    <Router />
  </Layout>
);

export default App;
