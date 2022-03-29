import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

import InsertDigitalContact from '../component/Contacts/InsertDigitalContact';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getDigitalAddresses } from '../redux/contact/actions';
import { RootState } from '../redux/store';
import CourtesyContacts from '../component/Contacts/CourtesyContacts';

const Contacts = () => {
  const { t } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const recipientId = useAppSelector((state: RootState) => state.userState.user.uid);
  const digitalAddresses = useAppSelector((state: RootState) => state.contactsState.digitalAddresses);

  useEffect(() => {
    void dispatch(getDigitalAddresses(recipientId));
  }, []);

  return (
    <Box style={{ padding: '20px' }}>
      <TitleBox variantTitle="h4" title={t('title')} subTitle={t('subtitle')} variantSubTitle={'body1'}/>
      <Grid container direction="row" sx={{marginTop: '20px'}} spacing={2}>
        <Grid item lg={6} xs={12}>
          {digitalAddresses.legal.length === 0 && <InsertDigitalContact recipientId={recipientId}/>}
          {digitalAddresses.legal.length > 0 && <div>Lista recapiti digitali</div>}
        </Grid>
        <Grid item lg={6} xs={12}>
          <CourtesyContacts />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contacts;
