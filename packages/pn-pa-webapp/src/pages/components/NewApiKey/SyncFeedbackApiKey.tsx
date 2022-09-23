import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { IllusCompleted } from '@pagopa/mui-italia';

import * as routes from '../../../navigation/routes.const';

const SyncFeedbackApiKey = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '350px', height: '100%', display: 'flex' }}>
      <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
        <IllusCompleted />
        <Typography variant="h4" color="text.primary" sx={{ margin: '20px 0 10px 0' }}>
          API Key generata!
        </Typography>
        <Typography variant="body1" color="text.primary">
          Per consentire l&apos;integrazione, copia il codice e inseriscilo nella piattaforma proprietaria dell&apos;ente.
        </Typography>
        <Button
          variant="contained"
          sx={{ marginTop: '30px' }}
          onClick={() => navigate(routes.API_KEYS)}
        >
          Vedi API Key generata
        </Button>
      </Box>
    </Box>
  );
};

export default SyncFeedbackApiKey;
