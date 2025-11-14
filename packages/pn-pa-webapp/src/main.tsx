import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';

import App from './App';
import { initAxiosClients } from './api/apiClients';
import { setUpInterceptor } from './api/interceptors';
import './i18n';
import './index.css';
import { initStore, store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import { loadPaConfiguration } from './services/configuration.service';
import { initOneTrust } from './utility/onetrust';

async function doTheRender() {
  const container = document.getElementById('root');
  const root = createRoot(container!);
  try {
    // load config from JSON file
    await loadPaConfiguration();

    // init actions (previously static code) which make use of config
    await initOneTrust();
    initStore();
    initAxiosClients();
    // move initialization of the Axios interceptor - PN-7557
    setUpInterceptor(store);

    // We need to comment out the StrictMode because it causes a rerender that
    // breaks the navigation inside TermsOfService and PrivacyPolicy pages.
    // PN-9549
    root.render(
      <Provider store={store}>
        {/* <React.StrictMode> */}
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback="loading...">
              <App />
            </Suspense>
          </ThemeProvider>
        </BrowserRouter>
        {/* </React.StrictMode> */}
      </Provider>
    );

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
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
