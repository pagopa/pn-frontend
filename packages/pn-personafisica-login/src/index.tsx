import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import { CssBaseline, ThemeProvider } from '@mui/material';

import './locales/i18n.ts';
import './index.css';
import App from './App';
import { loadLoginConfiguration } from "./services/configuration.service";
import { initOneTrust } from "./utils/onetrust";
import reportWebVitals from "./reportWebVitals";

async function doTheRender() {
  try {
    // load config from JSON file
    await loadLoginConfiguration();

    // init actions (previously static code) which make use of config
    initOneTrust();

    ReactDOM.render(
      <React.StrictMode>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={'loading...'}>
              <App />
            </Suspense>
          </ThemeProvider>
        </BrowserRouter>
      </React.StrictMode>,
      document.getElementById('root')
    );

    reportWebVitals();
  } catch (e) {
    console.error(e);

    ReactDOM.render(
      <React.StrictMode>
        <div style={{ fontSize: 20, marginLeft: '2rem' }}>Problems loading configuration - see console</div>
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
}

// actual launching of the React app
void doTheRender();
