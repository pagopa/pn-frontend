import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { IllusCompleted } from '@pagopa/mui-italia';

import * as routes from '../../../navigation/routes.const';

const SyncFeedbackApiKey = ({newApiKeyId = ''}) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '350px', height: '100%', display: 'flex' }}>
      <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
        <IllusCompleted />
        <Typography variant="h4" color="text.primary" sx={{ margin: '20px 0 10px 0' }}>
          API Key generata con successo!
        </Typography>
        <Typography variant="body1" color="text.primary">
          Per consentire l&apos;integrazione, copia il codice e inseriscilo nella piattaforma proprietaria dell&apos;ente.
        </Typography>
        <Box sx={{mt: 3, mb: 5}}>
          <TextField
            size="small"
            id="apiKeyId"
            value={newApiKeyId}
            name="apiKeyId"
            sx={{
              width: '450px',
              input: {
                textAlign: 'center',
                color: '#0073E6',
              },
            }}
            inputProps={{
              readOnly: true,
            }}
          />
        </Box>
        <Button
          variant="contained"
          sx={{ marginTop: '30px' }}
          onClick={() => navigate(routes.API_KEYS)}
        >
          Torna a API Key
        </Button>
      </Box>
    </Box>
  );
};

export default SyncFeedbackApiKey;
