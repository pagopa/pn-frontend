import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { initLocalization, initLocalizationExists } from '@pagopa-pn/pn-commons';

import Router from './navigation/routes';

const App = () => {
  const { t, i18n } = useTranslation(['common']);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      // init localization
      initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
      initLocalizationExists((namespace, path) => i18n.exists(path, { ns: namespace }));
    }
  }, [isInitialized]);

  return isInitialized ? <Router /> : <div />;
};

export default App;
