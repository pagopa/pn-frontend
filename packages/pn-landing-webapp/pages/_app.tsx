/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";

import { theme } from "@pagopa/mui-italia";
import LandingLayout from "../src/layout/LandingLayout";
import { LangProvider } from "../provider/lang-context";

import '../styles/default.css';

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
