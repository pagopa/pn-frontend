import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
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

    root.render(
      <React.StrictMode>
        <BrowserRouter basename="/auth">
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={'loading...'}>
              <App />
            </Suspense>
          </ThemeProvider>
        </BrowserRouter>
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
