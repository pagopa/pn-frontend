import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

import PublicKeys from '../components/IntegrazioneApi/PublicKeys';
import { PNRole } from '../redux/auth/types';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const ApiIntegration: React.FC = () => {
  const { t } = useTranslation(['integrazioneApi']);
  const { organization } = useAppSelector((state: RootState) => state.userState.user);
  const currentRoles = organization?.roles ? organization.roles.map((role) => role.role) : [];

  const isAdmin = currentRoles.includes(PNRole.ADMIN);

  return (
    <Box p={3}>
      <TitleBox
        variantTitle="h4"
        title={t('title')}
        subTitle={t('subTitle')}
        variantSubTitle="body1"
      />

      {isAdmin && <PublicKeys />}
    </Box>
  );
};

export default ApiIntegration;
