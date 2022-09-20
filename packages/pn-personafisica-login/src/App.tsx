import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useMultiEvent } from '@pagopa-pn/pn-commons';
import Router from './navigation/routes';
import { mixpanelInit } from './utils/mixpanel';
import './utils/onetrust';
import { VERSION } from './utils/constants';

declare const OneTrust: any;
declare const OnetrustActiveGroups: string;
const global = window as any;
// target cookies (Mixpanel)
const targCookiesGroup1 = 'C0001';
const targCookiesGroup2 = 'C0002';

const App = () => {
  useEffect(() => {
    // OneTrust callback at first time
    // eslint-disable-next-line functional/immutable-data
    global.OptanonWrapper = function () {
      OneTrust.OnConsentChanged(function () {
        const activeGroups = OnetrustActiveGroups;
        if (activeGroups.indexOf(targCookiesGroup1) > -1 || activeGroups.indexOf(targCookiesGroup2) > -1) {
          mixpanelInit();
        }
      });
    };
    // check mixpanel cookie consent in cookie
    const OTCookieValue: string =
      document.cookie.split('; ').find((row) => row.startsWith('OptanonConsent=')) || '';
    const checkValue1 = `${targCookiesGroup1}%3A1`;
    const checkValue2 = `${targCookiesGroup2}%3A1`;
    if (OTCookieValue.indexOf(checkValue1) > -1 || OTCookieValue.indexOf(checkValue2) > -1) {
      mixpanelInit();
    }
  }, []);

  const [clickVersion] = useMultiEvent({
    callback: () => console.log(`v${VERSION}`),
  });

  return (
    <>
      <Router />
      <Box onClick={clickVersion} sx={{ height: '5px', background: 'white' }}></Box>
    </>
  );
};

export default App;
