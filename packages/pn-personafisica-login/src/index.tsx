import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { theme } from '@pagopa/mui-italia';
import { ThemeProvider } from '@mui/material/styles';
import './locales/i18n.ts';
import App from './App';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <Suspense fallback={'loading...'}>
        <App />
      </Suspense>
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById('root')
);
