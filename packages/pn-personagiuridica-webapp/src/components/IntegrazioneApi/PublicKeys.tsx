import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Typography } from '@mui/material';
import { EmptyState, KnownSentiment, useIsMobile } from '@pagopa-pn/pn-commons';

const PublicKeys: React.FC = () => {
  const { t } = useTranslation(['integrazioneApi']);
  const isMobile = useIsMobile();

  //   const handleGeneratePublicKey = () => {
  //     navigate(routes.NUOVA_PUBLIC_KEY);
  //   };

  return (
    <Box mt={5}>
      <Box
        sx={{
          display: isMobile ? 'block' : 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: isMobile ? 3 : undefined }}>
          {t('public-keys-title')}
        </Typography>
        <Button
          id="generate-public-key"
          data-testid="generatePublicKey"
          variant="contained"
          sx={{ marginBottom: isMobile ? 3 : undefined }}
          //   onClick={handleGeneratePublicKey}
        >
          {t('new-public-key-button')}
        </Button>
      </Box>

      <EmptyState sentimentIcon={KnownSentiment.NONE}>{t('public-keys-empty-state')}</EmptyState>
    </Box>
  );
};

export default PublicKeys;
