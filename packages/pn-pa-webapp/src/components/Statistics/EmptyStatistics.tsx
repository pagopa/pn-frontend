/* eslint-disable functional/immutable-data */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper, Stack, SxProps, Theme, Typography } from '@mui/material';
import { IllusStatistics } from '@pagopa-pn/pn-commons';

type Props = {
  sx?: SxProps<Theme>;
};

const EmptyStatistics: React.FC<Props> = ({ sx }) => {
  const { t } = useTranslation(['statistics']);

  return (
    <Paper sx={{ p: 3, mb: 3, height: '100%', ...sx }} elevation={0}>
      <Stack direction="column" height="100%" sx={{ display: 'flex', textAlign: 'center' }}>
        {/* <Typography variant="h6" component="h3">
          {t('empty.title')}
        </Typography> */}
        <Typography sx={{ mt: 3, mb: 5 }} variant="body1" color="text.primary">
          {t('empty.description')}
        </Typography>
        <Box alignContent={'center'}>
          <IllusStatistics size={342} />
        </Box>
      </Stack>
    </Paper>
  );
};

export default EmptyStatistics;
