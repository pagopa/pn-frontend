import type { AppProps } from 'next/app';
import { ThemeProvider } from "@mui/material";
import { theme } from "@pagopa/mui-italia";
import LandingLayout from "../src/layout/LandingLayout";

import { LangProvider } from '../provider/lang-context';

import '../styles/default.css';

function Main({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <LangProvider>
        <LandingLayout>
          <Script
            src="/onetrust/privacy-notice-scripts/otnotice-1.0.min.js"
            type="text/javascript"
            charSet="UTF-8"
            id="otprivacy-notice-script"
            strategy="lazyOnload"
          />
          <Component {...pageProps} />
        </LandingLayout>
      </LangProvider>
    </ThemeProvider>
  );
}

export default Main;
