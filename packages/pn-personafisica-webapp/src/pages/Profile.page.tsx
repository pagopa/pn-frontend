import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const Profile = () => {
  const { t } = useTranslation(['profilo']);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);

  return (
    <Box style={{ padding: '20px' }}>
      <TitleBox
        variantTitle="h4"
        title={t('title', { ns: 'profilo' })}
        subTitle={t('subtitle', { ns: 'profilo' })}
        variantSubTitle={'body1'}
      />
      <Grid container direction="row" sx={{ marginTop: '20px' }} spacing={2}>
        <Grid item lg={2} xs={5}>
          <Typography variant="body2">{t('profile.name', { ns: 'profilo' })}</Typography>
        </Grid>
        <Grid item lg={10} xs={7}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{currentUser.name}</Typography>
        </Grid>
        <Grid item lg={2} xs={5}>
        <Typography variant="body2">{t('profile.family_name', { ns: 'profilo' })}</Typography>
        </Grid>
        <Grid item lg={10} xs={7}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{currentUser.family_name}</Typography>
        </Grid>
        <Grid item lg={2} xs={5}>
        <Typography variant="body2">{t('profile.fiscal_number', { ns: 'profilo' })}</Typography>
        </Grid>
        <Grid item lg={10} xs={7}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{currentUser.fiscal_number}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;