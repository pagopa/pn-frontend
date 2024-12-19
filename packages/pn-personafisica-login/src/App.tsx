import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { APP_VERSION, initLocalization, useMultiEvent, useTracking } from '@pagopa-pn/pn-commons';

import Router from './navigation/routes';
import { getConfiguration } from './services/configuration.service';
import './utility/onetrust';

const App = () => {
  const configuration = useMemo(() => getConfiguration(), []);

  useTracking(configuration.MIXPANEL_TOKEN, process.env.NODE_ENV);

  const [clickVersion] = useMultiEvent({
    callback: () => console.log(`v${APP_VERSION}`),
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
