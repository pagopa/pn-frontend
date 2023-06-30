import { Box, Button, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa-pn/pn-commons';
import { Download } from '@mui/icons-material';

import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const Statistics = () => {
  const { t } = useTranslation(['statistics']);
  const loggedUserOrganizationParty = useAppSelector(
    (state: RootState) => state.userState.user?.organization
  );

  const Subtitle = (
    <Grid item display="flex" flexDirection="row">
      <Typography>{t('subtitle', { organization: loggedUserOrganizationParty?.name })}</Typography>
      <Button variant="outlined" endIcon={<Download />} sx={{ whiteSpace: 'nowrap' }}>
        {t('export_all')}
      </Button>
    </Grid>
  );

  return (
    <Box p={3}>
      <TitleBox title={t('title')} variantTitle="h4" subTitle={Subtitle} variantSubTitle="body1" />
    </Box>
  );
};

export default Statistics;
