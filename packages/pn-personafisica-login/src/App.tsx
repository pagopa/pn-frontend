import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import {
  getSessionLanguage,
  initLocalization,
  useMultiEvent,
  useTracking,
} from '@pagopa-pn/pn-commons';

import Router from './navigation/routes';
import { getConfiguration } from './services/configuration.service';
import './utility/onetrust';

const App = () => {
  const configuration = useMemo(() => getConfiguration(), []);

  useTracking(configuration.MIXPANEL_TOKEN, process.env.NODE_ENV);

  const [clickVersion] = useMultiEvent({
    callback: () => console.log(`v${configuration.VERSION}`),
  });

  const { t, i18n } = useTranslation(['common']);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleSetUserLanguage = async () => {
    const language = getSessionLanguage() || 'it';
    await i18n.changeLanguage(language);
  };

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      // init localization
      initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
      void handleSetUserLanguage();
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
