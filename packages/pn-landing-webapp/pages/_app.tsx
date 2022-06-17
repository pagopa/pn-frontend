import React, { Suspense } from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from "@mui/material";
import { theme } from "@pagopa/mui-italia";
import LandingLayout from "../src/layout/LandingLayout";

import '../styles/globals.css';

function Main({ Component, pageProps }: AppProps) {
  // TODO: fix typescript error and remove ts-ignore
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  return <ThemeProvider theme={theme}><Suspense fallback={'loading...'}><LandingLayout><Component {...pageProps} /></LandingLayout></Suspense></ThemeProvider>;
}

export default Main;
