/* eslint-disable functional/immutable-data */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Stack, SxProps, Theme, Typography } from '@mui/material';
import { IllusStatistics } from '@pagopa-pn/pn-commons';

type Props = {
  description?: string;
  sx?: SxProps<Theme>;
};

const EmptyStatistics: React.FC<Props> = ({ description = 'empty.no_data_found', sx }) => {
  const { t } = useTranslation(['statistics']);

  return (
    <Stack
      direction="column"
      height="100%"
      sx={{ display: 'flex', justifyContent: 'space-evenly', textAlign: 'center', ...sx }}
      data-testid="emptyStatistics"
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ mt: 3, mb: 5 }} variant="body1" color="text.primary">
          {t(description)}
        </Typography>
      </Box>
      <Box data-testid="empty-image" textAlign={'center'}>
        <IllusStatistics size={342} />
      </Box>
    </Stack>
  );
};

export default EmptyStatistics;
