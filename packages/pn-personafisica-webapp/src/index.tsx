import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from "@pagopa/mui-italia";
import { LoadingPage } from '@pagopa-pn/pn-commons';

import './index.css';
import reportWebVitals from './reportWebVitals';
import { initStore, store } from './redux/store';
import './i18n.ts';
import App from './App';
import { loadPfConfiguration } from "./services/configuration.service";
import { initOneTrust } from "./utils/onetrust";
import { initAxiosClients } from "./api/apiClients";

async function doTheRender() {
  try {
    // load config from JSON file
    await loadPfConfiguration();

    // init actions (previously static code) which make use of config
    initOneTrust();
    initStore();
    initAxiosClients();

    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Suspense fallback={<LoadingPage renderType="whole"/>}>
                <App />
              </Suspense>
            </ThemeProvider>
          </BrowserRouter>
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
    );

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
  } catch (e) {
    console.error(e);

    ReactDOM.render(
      <React.StrictMode>
        <div style={{fontSize: 20, marginLeft: '2rem'}}>Problems loading configuration - see console</div>
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
}

// actual launching of the React app
void doTheRender();