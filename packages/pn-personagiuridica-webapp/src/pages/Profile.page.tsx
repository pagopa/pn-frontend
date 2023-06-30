import { useTranslation } from 'react-i18next';
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

import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { RECAPITI } from '../navigation/routes.const';
import { trackEventByType } from "../utils/mixpanel";
import { TrackEventType } from "../utils/events";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['profilo']);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);

  const alertButtonStyle: SxProps<Theme> = useIsMobile()
    ? { textAlign: 'center' }
    : { textAlign: 'center', minWidth: 'max-content' };

  const handleRedirectToContactsPage = () => {
    trackEventByType(TrackEventType.USER_VIEW_CONTACTS_PROFILE);
    navigate(RECAPITI);
  };

  return (
    <Box p={3}>
      <TitleBox
        variantTitle="h4"
        title={t('title', { ns: 'profilo' })}
        subTitle={t('subtitle', { ns: 'profilo' })}
        variantSubTitle={'body1'}
      />

      <Grid container direction="row" spacing={2}>
        <Grid item lg={8} xs={12}>
          <Paper sx={{ padding: '24px', marginTop: '20px' }} className="paperContainer">
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
            aria-label="contacts-redirect"
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
