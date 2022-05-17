import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Link, Typography } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getDigitalAddresses, resetContactsState } from '../redux/contact/actions';
import { RootState } from '../redux/store';
import { DigitalContactsCodeVerificationProvider } from '../component/Contacts/DigitalContactsCodeVerification.context';
import InsertLegalContact from '../component/Contacts/InsertLegalContact';
import LegalContactsList from '../component/Contacts/LegalContactsList';
import CourtesyContacts from '../component/Contacts/CourtesyContacts';
import SpecialContacts from '../component/Contacts/SpecialContacts';
import { PROFILO } from '../navigation/routes.const';

const Contacts = () => {
  const navigate = useNavigate();
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

  const handleRedirectToProfilePage = () => {
    navigate(PROFILO);
  };

  const subtitle = (
    <>
      {t('subtitle-1', { ns: 'recapiti' })}
      <Link color="primary" fontWeight={'bold'} onClick={handleRedirectToProfilePage}>
        {t('subtitle-link', { ns: 'recapiti' })}
      </Link>
      {t('subtitle-2', { ns: 'recapiti' })}
    </>
  );

  return (
    <DigitalContactsCodeVerificationProvider>
      <Box style={{ padding: '20px' }}>
        <TitleBox
          variantTitle="h4"
          title={t('title')}
          subTitle={subtitle}
          variantSubTitle={'body1'}
        />
        <Typography variant="h5" fontWeight={600} fontSize={28} sx={{ marginTop: '30px' }}>
          {t('general-contacts-title')}
        </Typography>
        <Grid container direction="row" sx={{ marginTop: '5px' }} spacing={2}>
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
            <CourtesyContacts recipientId={recipientId} contacts={digitalAddresses.courtesy} />
          </Grid>
        </Grid>
        {(digitalAddresses.legal.length > 0 || digitalAddresses.courtesy.length > 0) && (
          <Fragment>
            <Typography variant="h5" fontWeight={600} fontSize={28} sx={{ marginTop: '30px' }}>
              {t('special-contacts-title')}
            </Typography>
            <Box sx={{ marginTop: '20px' }}>
              <SpecialContacts
                recipientId={recipientId}
                legalAddresses={digitalAddresses.legal}
                courtesyAddresses={digitalAddresses.courtesy}
              />
            </Box>
          </Fragment>
        )}
      </Box>
    </DigitalContactsCodeVerificationProvider>
  );
};

export default Contacts;
