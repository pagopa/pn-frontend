import { Box } from '@mui/material';
import { useMultiEvent, useTracking } from '@pagopa-pn/pn-commons';

import Router from './navigation/routes';
import './utils/onetrust';
import { MIXPANEL_TOKEN, VERSION } from './utils/constants';

const App = () => {
  useTracking(MIXPANEL_TOKEN, process.env.NODE_ENV);

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
