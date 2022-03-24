import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@mui/material';
import { TitleAndDescription } from '@pagopa-pn/pn-commons';

import DigitalContacts from './components/Contacts/DigitalContacts';

const Contacts = () => {
  const { t } = useTranslation(['recapiti']);

  return (
    <Box style={{ padding: '20px' }}>
      <TitleAndDescription title={t('title')}>{t('subtitle')}</TitleAndDescription>
      <Grid container direction="row" sx={{marginTop: '20px'}} spacing={2}>
        <Grid item lg={6} xs={12}>
          <DigitalContacts />
        </Grid>
        <Grid item lg={6} xs={12}>Recapito di cortesia</Grid>
      </Grid>
    </Box>
  );
};

export default Contacts;
