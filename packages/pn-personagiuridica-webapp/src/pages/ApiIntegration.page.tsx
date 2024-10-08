import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { TitleBox, useHasPermissions } from '@pagopa-pn/pn-commons';

import PublicKeys from '../components/IntegrazioneApi/PublicKeys';
import { PNRole } from '../redux/auth/types';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const ApiIntegration: React.FC = () => {
  const { t } = useTranslation(['integrazioneApi']);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const role = currentUser.organization?.roles ? currentUser.organization?.roles[0] : null;
  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);

  const isAdminWithoutGroups = userHasAdminPermissions && !currentUser.hasGroup;

  return (
    <Box p={3}>
      <TitleBox
        variantTitle="h4"
        title={t('title')}
        subTitle={t('subTitle')}
        variantSubTitle="body1"
      />

      {isAdminWithoutGroups && <PublicKeys />}
    </Box>
  );
};

export default ApiIntegration;
