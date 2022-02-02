import { Route, Routes } from 'react-router-dom';
import { LoadingOverlay, Layout } from '@pagopa-pn/pn-commons';

const App = () => (
  <Layout assistanceEmail={process.env.REACT_APP_PAGOPA_HELP_EMAIL}>
    <LoadingOverlay />
    <Routes>
      <Route path="/" element={<h1>Welcome to Piattaforma Notifiche per il cittadino</h1>} />
    </Routes>
  </Layout>
);

export default App;
