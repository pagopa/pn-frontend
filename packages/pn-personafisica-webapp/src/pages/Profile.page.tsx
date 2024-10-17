import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Grid, Paper, Typography } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import { PFEventsType } from '../models/PFEventsType';
import { ContactSource } from '../models/contacts';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const Profile = () => {
  const { t } = useTranslation(['profilo']);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_PROFILE);
  }, []);

  return (
    <Box p={3}>
      <DomicileBanner source={ContactSource.PROFILO} />

      <TitleBox
        variantTitle="h4"
        title={t('title', { ns: 'profilo' })}
        subTitle={t('subtitle', { ns: 'profilo' })}
        variantSubTitle={'body1'}
      />

      <Grid container direction="row" spacing={2}>
        <Grid item lg={8} xs={12}>
          <Paper sx={{ padding: '24px', marginTop: '20px' }} elevation={0}>
            <Grid container direction="row">
              <Grid item lg={2} xs={5}>
                <Typography variant="body2">{t('profile.name', { ns: 'profilo' })}</Typography>
              </Grid>
              <Grid item lg={10} xs={7}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {currentUser.name}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item lg={2} xs={5}>
                <Typography variant="body2">
                  {t('profile.family_name', { ns: 'profilo' })}
                </Typography>
              </Grid>
              <Grid item lg={10} xs={7}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {currentUser.family_name}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item lg={2} xs={5}>
                <Typography variant="body2">
                  {t('profile.fiscal_number', { ns: 'profilo' })}
                </Typography>
              </Grid>
              <Grid item lg={10} xs={7}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {currentUser.fiscal_number}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
