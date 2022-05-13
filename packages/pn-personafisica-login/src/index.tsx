import React from 'react';
import ReactDOM from 'react-dom';
import { theme } from "@pagopa/mui-italia";
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import './locale/i18n';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById('root')
);
