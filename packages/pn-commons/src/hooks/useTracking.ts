import { useEffect } from 'react';

import { mixpanelInit } from '../utility/mixpanel.utility';

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
    // OneTrust callback at first time
    // eslint-disable-next-line functional/immutable-data
    global.OptanonWrapper = function () {
      OneTrust.OnConsentChanged(function () {
        if (OnetrustActiveGroups.indexOf(targCookiesGroup) > -1) {
          mixpanelInit(mixpanelToken, nodeEnv);
        }
      });
    };
    // // check mixpanel cookie consent in cookie
    const OTCookieValue: string =
      document.cookie.split('; ').find((row) => row.startsWith('OptanonConsent=')) || '';
    const checkValue = `${targCookiesGroup}%3A1`;

    if (OTCookieValue.indexOf(checkValue) > -1) {
      mixpanelInit(mixpanelToken, nodeEnv);
    }
  }, []);
}
