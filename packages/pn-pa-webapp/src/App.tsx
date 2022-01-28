import { Route, Routes } from 'react-router-dom';
import { LoadingOverlay, Layout } from '@pagopa-pn/pn-commons';

const App = () => (
  <Layout assistanceEmail={'email@pagopa.it'}>
    <LoadingOverlay />
    <Routes>
      <Route path="/" element={<h1>Welcome to Piattaforma Notifiche</h1>} />
    </Routes>
  </Layout>
);

export default App;
