import { Trans, useTranslation } from 'react-i18next';

import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { getConfiguration } from '../services/configuration.service';

const SupportPPButton: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { PAGOPA_HELP_PP } = getConfiguration();
  const handleClick = () => {
    window.location.assign(PAGOPA_HELP_PP);
  };

  return (
    <ButtonNaked sx={{ verticalAlign: 'top' }} onClick={handleClick}>
      <Typography variant="body2" color="primary" display="inline">
        {children}
      </Typography>
    </ButtonNaked>
  );
};
const SupportPage: React.FC = () => {
  const { t } = useTranslation(['support', 'common']);
  const isMobile = useIsMobile();

  return (
    <Grid container justifyContent="center" alignContent="center">
      <Grid item xs={6}>
        <TitleBox
          mtGrid={3}
          title={t('title')}
          variantTitle="h3"
          subTitle={t('sub-title')}
          variantSubTitle="body1"
        />
        <Paper sx={{ p: 3, mt: 4 }}>
          <form>
            <TextField
              id="mail"
              label={t('form.email')}
              name="mail"
              size="small"
              type="mail"
              fullWidth
            />
            <TextField
              id="confirmMail"
              label={t('form.confirm-email')}
              name="confirmMail"
              size="small"
              type="mail"
              fullWidth
              sx={{ mt: 4 }}
            />
          </form>
        </Paper>
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          <Trans
            ns={'support'}
            i18nKey={'disclaimer'}
            components={[<SupportPPButton key="support-pp-button" />]}
            variant="body2"
          />
        </Typography>
        <Box
          sx={{ my: 3 }}
          display="flex"
          flexDirection={isMobile ? 'column' : 'row-reverse'}
          justifyContent="space-between"
          alignItems="center"
        >
          <Button variant="contained" size="small" fullWidth={isMobile}>
            {t('button.continue', { ns: 'common' })}
          </Button>
          <Button
            variant="outlined"
            size="small"
            fullWidth={isMobile}
            sx={{ mt: isMobile ? 2 : 0 }}
          >
            {t('button.indietro', { ns: 'common' })}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SupportPage;
