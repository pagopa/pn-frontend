import { LoadingOverlay, Layout } from '@pagopa-pn/pn-commons';
import Router from './navigation/routes';

const App = () => (
  <Layout assistanceEmail={'email@pagopa.it'}>
    <LoadingOverlay />
    <Router />
  </Layout>
);

export default App;
