import type { AppProps } from 'next/app';
import { ThemeProvider } from "@mui/material";
import { theme } from "@pagopa/mui-italia";
import LandingLayout from "../src/layout/LandingLayout";

import { LangProvider } from '../provider/lang-context';

function Main({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <LangProvider>
        <LandingLayout>
          <Component {...pageProps} />
        </LandingLayout>
      </LangProvider>
    </ThemeProvider>
  );
}

export default Main;
