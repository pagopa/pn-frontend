import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from "@mui/material";
import { theme } from "@pagopa/mui-italia";
import LandingLayout from "../src/layout/LandingLayout";

function Main({ Component, pageProps }: AppProps) {
  // TODO: fix typescript error and remove ts-ignore
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  return <ThemeProvider theme={theme}><LandingLayout><Component {...pageProps} /></LandingLayout></ThemeProvider>;
}

export default Main;
