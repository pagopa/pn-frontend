import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import { CopyToClipboard } from '@pagopa-pn/pn-commons';
import { useTranslation } from 'react-i18next';
import { IllusCompleted } from '@pagopa/mui-italia';

import * as routes from '../../../navigation/routes.const';

const SyncFeedbackApiKey = ({ newApiKeyId = '' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['apikeys']);

  return (
    <Box sx={{ minHeight: '350px', height: '100%', display: 'flex' }}>
      <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
        <IllusCompleted />
        <Typography variant="h4" color="text.primary" sx={{ margin: '20px 0 10px 0' }}>
          {t('api-key-succesfully-generated')}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {t('copy-the-api-key')}
        </Typography>
        <Box sx={{ mt: 3, mb: 5 }}>
          <TextField
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
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <CopyToClipboard
                    tooltipMode={true}
                    tooltip={t('api-key-copied')}
                    getValue={() => newApiKeyId || ''}
                  />
                </InputAdornment>
              ),
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
          {t('go-to-api-keys')}
        </Button>
      </Box>
    </Box>
  );
};

export default SyncFeedbackApiKey;
