import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from "@pagopa/mui-italia";

import './index.css';
import reportWebVitals from './reportWebVitals';
import { initStore, store } from './redux/store';
import './i18n.ts';
import App from './App';
import { initOneTrust } from './utils/onetrust';
import { loadPaConfiguration } from './services/configuration.service';


async function doTheRender() {
  try {
    await loadPaConfiguration();
    initOneTrust();
    initStore();
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Suspense fallback="loading...">
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
doTheRender();
