import { useEffect } from 'react';
import Router from './navigation/routes';
import './utils/onetrust';

declare const OneTrust: any;
declare const OnetrustActiveGroups: string;
const global = window as any;
// target cookies (Mixpanel)
const targCookiesGroup = "C0004";

const App = () => {

  useEffect(() => {
    // OneTrust callback at first time
    // eslint-disable-next-line functional/immutable-data
    global.OptanonWrapper = function () {
      OneTrust.OnConsentChanged(function () {
        const activeGroups = OnetrustActiveGroups;
        if (activeGroups.indexOf(targCookiesGroup) > -1) {
          console.log("TODO init mixpanel");
        }
      });
    };
    // check mixpanel cookie consent in cookie
    const OTCookieValue: string =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("OptanonConsent=")) || "";
    const checkValue = `${targCookiesGroup}%3A1`;
    if (OTCookieValue.indexOf(checkValue) > -1) {
      console.log("TODO init mixpanel");
    }
  }, []);

  
  return <Router />;
};

export default App;
