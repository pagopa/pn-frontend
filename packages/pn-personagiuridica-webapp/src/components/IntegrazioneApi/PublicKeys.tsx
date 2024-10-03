import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Stack, Typography } from '@mui/material';
import { EmptyState, KnownSentiment } from '@pagopa-pn/pn-commons';
import { useNavigate } from 'react-router-dom';

import * as routes from '../../navigation/routes.const';

const PublicKeys: React.FC = () => {
  const { t } = useTranslation(['integrazioneApi']);
  const navigate = useNavigate();

  const handleGeneratePublicKey = () => {
    navigate(routes.REGISTRA_CHIAVE_PUBBLICA);
  };

  return (
    <>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'start', lg: 'center' },
          mb: 3,
          mt: 5,
        }}
      >
        <Typography variant="h6" sx={{ mb: { xs: 3, lg: 0 } }}>
          {t('public-keys-title')}
        </Typography>

        <Button
          id="generate-public-key"
          data-testid="generatePublicKey"
          variant="contained"
          sx={{ mb: { xs: 3, lg: 0 } }}
          onClick={handleGeneratePublicKey}
        >
          {t('new-public-key-button')}
        </Button>
      </Stack>

      <EmptyState sentimentIcon={KnownSentiment.NONE}>{t('public-keys-empty-state')}</EmptyState>
    </>
  );
};

export default PublicKeys;
