import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { CopyToClipboard, useIsMobile } from '@pagopa-pn/pn-commons';
import { IllusCompleted } from '@pagopa/mui-italia';

import * as routes from '../../navigation/routes.const';

const SyncFeedbackApiKey = ({ newApiKey = '' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['apikeys']);
  const isMobile = useIsMobile('xl');
  return (
    <Box
      sx={{
        minHeight: '350px',
        height: '100%',
        display: 'flex',
        marginTop: isMobile ? '30px' : 'auto',
        marginBottom: isMobile ? '30px' : 'auto',
      }}
    >
      <Box
        sx={{
          margin: 'auto',
          textAlign: 'center',
          width: '80vw',
          marginTop: isMobile ? '0' : 'auto',
        }}
      >
        <IllusCompleted />
        <Typography
          id="api-key-succesfully-generated"
          variant="h4"
          color="text.primary"
          sx={{ margin: '20px 0 10px 0' }}
        >
          {t('api-key-succesfully-generated')}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {t('copy-the-api-key')}
        </Typography>
        <Box sx={{ mt: 3, mb: 5 }}>
          <TextField
            id="apiKeyId"
            data-testid="apiKeyValue"
            value={newApiKey}
            name="apiKeyId"
            sx={{
              width: isMobile ? '100%' : '450px',
              maxWidth: '450px',
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
                    getValue={() => newApiKey ?? ''}
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
          id="go-to-api-keys"
          variant="contained"
          sx={{ marginBottom: '30px' }}
          onClick={() => navigate(routes.API_KEYS)}
        >
          {t('go-to-api-keys')}
        </Button>
      </Box>
    </Box>
  );
};

export default SyncFeedbackApiKey;
