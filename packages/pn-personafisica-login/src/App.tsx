import { Box } from '@mui/material';
import { initLocalization, useMultiEvent, useTracking } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Router from './navigation/routes';
import './utils/onetrust';
import { getConfiguration } from "./services/configuration.service";

const App = () => {
  const { MIXPANEL_TOKEN, VERSION } = getConfiguration();
  useTracking(MIXPANEL_TOKEN, process.env.NODE_ENV);

  const [clickVersion] = useMultiEvent({
    callback: () => console.log(`v${VERSION}`),
  });

  const { t } = useTranslation(['common']);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      // init localization
      initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
    }
  }, [isInitialized]);

  return isInitialized ? (
    <>
      <Router />
      <Box onClick={clickVersion} sx={{ height: '5px', background: 'white' }}></Box>
    </>
  ) : (
    <div />
  );
};

export default App;
