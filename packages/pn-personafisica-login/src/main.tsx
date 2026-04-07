import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { LoadingPage } from '@pagopa-pn/pn-commons';
import { theme } from '@pagopa/mui-italia';

import App from './App';
import './i18n';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { loadLoginConfiguration } from './services/configuration.service';
import { initOneTrust } from './utility/onetrust';

async function doTheRender() {
  const container = document.getElementById('root');
  const root = createRoot(container!);
  try {
    // load config from JSON file
    await loadLoginConfiguration();

    // init actions (previously static code) which make use of config
    await initOneTrust();

    const router = createBrowserRouter(
      [
        {
          path: '*',
          element: <App />,
        },
      ],
      {
        basename: '/auth',
      }
    );

    root.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<LoadingPage renderType="whole" />}>
            <RouterProvider router={router} />
          </Suspense>
        </ThemeProvider>
      </React.StrictMode>
    );

    reportWebVitals();
  } catch (e) {
    console.error(e);

    root.render(
      <React.StrictMode>
        <div style={{ fontSize: 20, marginLeft: '2rem' }}>
          Problems loading configuration - see console
        </div>
      </React.StrictMode>
    );
  }
}

// actual launching of the React app
void doTheRender();
