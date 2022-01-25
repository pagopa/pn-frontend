import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary, LoadingOverlay } from '@pagopa/selfcare-common-frontend';
import { Layout } from '@pagopa-pn/pn-commons';

const App = () => (
  <ErrorBoundary>
    <Layout>
      <LoadingOverlay />
      <Routes>
        <Route path="/" element={<h1>Welcome to Piattaforma Notifiche</h1>} />
      </Routes>
    </Layout>
  </ErrorBoundary>
);

export default App;
