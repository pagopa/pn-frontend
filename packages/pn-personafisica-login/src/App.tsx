import { useEffect } from "react";
import { useUnload } from "@pagopa-pn/pn-commons";
import Router from './navigation/routes';
import { mixpanelInit, trackEventByType } from "./utils/mixpanel";
import { TrackEventType } from "./utils/events";
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
          mixpanelInit();
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
      mixpanelInit();
    }
  }, []);

  useUnload((e: Event) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    e.defaultPrevented;
    trackEventByType(TrackEventType.APP_UNLOAD);
  });

  return <Router />;
};

export default App;
