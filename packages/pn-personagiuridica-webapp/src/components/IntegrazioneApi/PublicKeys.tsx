import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Typography } from '@mui/material';
import { EmptyState, KnownSentiment, useHasPermissions, useIsMobile } from '@pagopa-pn/pn-commons';

import { PNRole } from '../../redux/auth/types';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

const PublicKeys: React.FC = () => {
  const { t } = useTranslation(['integrazioneApi']);
  const isMobile = useIsMobile();
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const role = currentUser.organization?.roles ? currentUser.organization?.roles[0] : null;
  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);

  const isAdminWithoutGroups = userHasAdminPermissions && !currentUser.hasGroup;

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
        {isAdminWithoutGroups && (
          <Button
            id="generate-public-key"
            data-testid="generatePublicKey"
            variant="contained"
            sx={{ marginBottom: isMobile ? 3 : undefined }}
            //   onClick={handleGeneratePublicKey}
          >
            {t('new-public-key-button')}
          </Button>
        )}
      </Box>

      <EmptyState sentimentIcon={KnownSentiment.NONE}>{t('public-keys-empty-state')}</EmptyState>
    </Box>
  );
};

export default PublicKeys;
