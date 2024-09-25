import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  Link,
  Paper,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';

import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import { PFEventsType } from '../models/PFEventsType';
import { ContactSource } from '../models/contacts';
import { RECAPITI } from '../navigation/routes.const';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['profilo']);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_PROFILE);
  }, []);

  const alertButtonStyle: SxProps<Theme> = useIsMobile()
    ? { textAlign: 'center' }
    : { textAlign: 'center', minWidth: 'max-content' };

  const handleRedirectToContactsPage = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_VIEW_CONTACT_DETAILS, {
      source: 'profilo',
    });
    navigate(RECAPITI);
  };

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

        <Grid item lg={8} xs={12}>
          <Alert
            severity="info"
            data-testid="contacts-redirect"
            action={
              <Button
                component={Link}
                color="primary"
                sx={alertButtonStyle}
                onClick={handleRedirectToContactsPage}
              >
                {t('alert-redirect-to-contacts.action-text', { ns: 'profilo' })}
              </Button>
            }
          >
            <AlertTitle>
              <Typography fontWeight={'bold'} variant="body1">
                {t('alert-redirect-to-contacts.title', { ns: 'profilo' })}
              </Typography>
            </AlertTitle>
            <Typography variant="body2">
              {t('alert-redirect-to-contacts.message', { ns: 'profilo' })}
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
