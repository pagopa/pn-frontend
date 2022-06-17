import type { AppProps } from 'next/app';
import { ThemeProvider } from "@mui/material";
import { theme } from "@pagopa/mui-italia";
import LandingLayout from "../src/layout/LandingLayout";

import '../styles/globals.css';

function Main({ Component, pageProps }: AppProps) {
  return <ThemeProvider theme={theme}><LandingLayout><Component {...pageProps} /></LandingLayout></ThemeProvider>;
}

export default Main;
