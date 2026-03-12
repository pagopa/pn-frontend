import 'mixpanel-browser';

declare module 'mixpanel-browser' {
  interface Config {
    stop_utm_persistence?: boolean;
  }
}
