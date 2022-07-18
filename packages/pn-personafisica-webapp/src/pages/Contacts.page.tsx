import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Link, Stack, Typography } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getDigitalAddresses, resetContactsState } from '../redux/contact/actions';
import { RootState } from '../redux/store';
import { DigitalContactsCodeVerificationProvider } from '../component/Contacts/DigitalContactsCodeVerification.context';
import InsertLegalContact from '../component/Contacts/InsertLegalContact';
import LegalContactsList from '../component/Contacts/LegalContactsList';
import IOContact from '../component/Contacts/IOContact';
import CourtesyContacts from '../component/Contacts/CourtesyContacts';
import SpecialContacts from '../component/Contacts/SpecialContacts';
import { PROFILO } from '../navigation/routes.const';
import { CourtesyChannelType } from '../models/contacts';

const Contacts = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const recipientId = useAppSelector((state: RootState) => state.userState.user.uid);
  const digitalAddresses = useAppSelector(
    (state: RootState) => state.contactsState.digitalAddresses
  );

  const contactIO = digitalAddresses.courtesy.find(
    (address) => address.channelType === CourtesyChannelType.IOMSG
  );
  //  /* eslint-disable functional/no-let */
  //  let contactIO = digitalAddresses.courtesy.find(
  //   (address) => address.channelType === CourtesyChannelType.IOMSG
  // );

  // if(!contactIO) {
  //   contactIO = {
  //     addressType: "COURTESY",
  //     recipientId: "PF-9319addf-6f72-4438-8b39-dcc25cbfcbc8",
  //     senderId: "default",
  //     channelType: CourtesyChannelType.IOMSG,
  //     value: IOAllowedValues.DISABLED,
  //     code: "00000"
  //   };
  // }

  useEffect(() => {
    void dispatch(getDigitalAddresses(recipientId));
    return () => void dispatch(resetContactsState());
  }, []);

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
      <Box p={3}>
        <TitleBox
          variantTitle="h4"
          title={t('title')}
          subTitle={subtitle}
          variantSubTitle={'body1'}
        />

        <Stack direction="column" spacing={8} mt={8}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
              <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
                {digitalAddresses.legal.length === 0 ? (
                  <InsertLegalContact recipientId={recipientId} />
                ) : (
                  <LegalContactsList
                    recipientId={recipientId}
                    legalAddresses={digitalAddresses.legal}
                  />
                )}
              </Box>
              <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
                <IOContact recipientId={recipientId} contact={contactIO} />
              </Box>
            </Stack>
            <CourtesyContacts recipientId={recipientId} contacts={digitalAddresses.courtesy} />
          </Stack>
          {(digitalAddresses.legal.length > 0 || digitalAddresses.courtesy.length > 0) && (
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={600} fontSize={28}>
                {t('special-contacts-title')}
              </Typography>
              <SpecialContacts
                recipientId={recipientId}
                legalAddresses={digitalAddresses.legal}
                courtesyAddresses={digitalAddresses.courtesy}
              />
            </Stack>
          )}
        </Stack>
      </Box>
    </DigitalContactsCodeVerificationProvider>
  );
};

export default Contacts;
