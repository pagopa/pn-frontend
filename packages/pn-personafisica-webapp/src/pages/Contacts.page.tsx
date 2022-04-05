import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getDigitalAddresses, resetContactsState } from '../redux/contact/actions';
import { RootState } from '../redux/store';
import { DigitalContactsCodeVerificationProvider } from '../component/Contacts/DigitalContactsCodeVerification.context';
import InsertLegalContact from '../component/Contacts/InsertLegalContact';
import LegalContactsList from '../component/Contacts/LegalContactsList';
import CourtesyContacts from '../component/Contacts/CourtesyContacts';

const Contacts = () => {
  const { t } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const recipientId = useAppSelector((state: RootState) => state.userState.user.uid);
  const digitalAddresses = useAppSelector(
    (state: RootState) => state.contactsState.digitalAddresses
  );

  useEffect(() => {
    void dispatch(getDigitalAddresses(recipientId));
  }, []);

  useEffect(() => () => void dispatch(resetContactsState()), []);

  return (
    <DigitalContactsCodeVerificationProvider>
      <Box style={{ padding: '20px' }}>
        <TitleBox
          variantTitle="h4"
          title={t('title')}
          subTitle={t('subtitle')}
          variantSubTitle={'body1'}
        />
        <Grid container direction="row" sx={{ marginTop: '20px' }} spacing={2}>
          <Grid item lg={6} xs={12}>
            {digitalAddresses.legal.length === 0 && (
              <InsertLegalContact recipientId={recipientId} />
            )}
            {digitalAddresses.legal.length > 0 && (
              <LegalContactsList
                recipientId={recipientId}
                legalAddresses={digitalAddresses.legal}
              />
            )}
          </Grid>
          <Grid item lg={6} xs={12}>
            <CourtesyContacts />
          </Grid>
        </Grid>
      </Box>
    </DigitalContactsCodeVerificationProvider>
  );
};

export default Contacts;
