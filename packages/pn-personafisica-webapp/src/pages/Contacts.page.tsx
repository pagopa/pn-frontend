import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

import InsertDigitalContact from '../component/Contacts/InsertDigitalContact';

const Contacts = () => {
  const { t } = useTranslation(['recapiti']);

  return (
    <Box style={{ padding: '20px' }}>
      <TitleBox variantTitle="h4" title={t('title')} subTitle={t('subtitle')} variantSubTitle={'body1'}/>
      <Grid container direction="row" sx={{marginTop: '20px'}} spacing={2}>
        <Grid item lg={6} xs={12}>
          <InsertDigitalContact />
        </Grid>
        <Grid item lg={6} xs={12}>Recapito di cortesia</Grid>
      </Grid>
    </Box>
  );
};

export default Contacts;
