import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Stack, SxProps, Theme, Typography } from '@mui/material';
import { IllusStatistics } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import * as routes from '../../navigation/routes.const';

type Props = {
  description?: string;
  sx?: SxProps<Theme>;
};

type LinkDashboardProps = {
  children?: React.ReactNode;
};

const LinkDashboard: React.FC<LinkDashboardProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <ButtonNaked
      onClick={() => navigate(routes.DASHBOARD)}
      color="primary"
      data-testid="link-to-dashboard"
      sx={{ display: 'inline', verticalAlign: 'unset', fontSize: 'inherit' }}
    >
      {children}
    </ButtonNaked>
  );
};

const EmptyStatistics: React.FC<Props> = ({ description = 'empty.no_data_found', sx }) => {
  const { t } = useTranslation(['statistics']);

  const getMessage = (description: string) => {
    if (description === 'empty.not_enough_data') {
      return (
        <Trans
          ns="statistics"
          i18nKey="empty.not_enough_data"
          components={[<LinkDashboard key="link-dashboard" />]}
        />
      );
    }

    return t(description);
  };

  return (
    <Stack
      direction="column"
      height="100%"
      sx={{ display: 'flex', justifyContent: 'space-evenly', textAlign: 'center', ...sx }}
      data-testid="emptyStatistics"
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ mt: 3, mb: 5 }} variant="body1" color="text.primary">
          {getMessage(description)}
        </Typography>
      </Box>
      <Box data-testid="empty-image" textAlign={'center'}>
        <IllusStatistics size={342} />
      </Box>
    </Stack>
  );
};

export default EmptyStatistics;
