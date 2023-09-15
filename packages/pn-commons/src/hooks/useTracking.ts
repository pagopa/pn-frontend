import { useEffect } from "react";
import { mixpanelInit } from "../utils/mixpanel.utility";

declare const OneTrust: any;
declare const OnetrustActiveGroups: string;
const global = window as any;
// target cookies (Mixpanel)
const targCookiesGroup = 'C0002';


/**
 * React hook that sets up Mixpanel tracking based on OneTrust consent settings. 
 * It listens for changes in OneTrust consent and checks for the presence of a 
 * specific cookie value to determine whether to initialize Mixpanel tracking.
 * @param {string} mixpanelToken:string
 * @param {string} nodeEnv:string
 */
export function useTracking(mixpanelToken: string, nodeEnv: string) {
  useEffect(() => {
    global.OptanonWrapper = function () {
      OneTrust.OnConsentChanged(handleConsentChange);
    };

    handleConsentChange();
  }, []);

  function handleConsentChange() {
    if (OnetrustActiveGroups.includes(targCookiesGroup) || checkOptanonCookie()) {
      mixpanelInit(mixpanelToken, nodeEnv);
    }
  } 

  function checkOptanonCookie(): boolean {
    const OTCookieValue: string =
      document.cookie.split('; ').find((row) => row.startsWith('OptanonConsent=')) || '';
    return OTCookieValue.includes(`${targCookiesGroup}%3A1`);
  }
}
