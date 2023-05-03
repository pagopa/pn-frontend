import { useEffect, useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Link, Stack, Typography } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { resetState } from '../redux/contact/reducers';
import { RootState } from '../redux/store';
import { DigitalContactsCodeVerificationProvider } from '../component/Contacts/DigitalContactsCodeVerification.context';
import InsertLegalContact from '../component/Contacts/InsertLegalContact';
import LegalContactsList from '../component/Contacts/LegalContactsList';
import IOContact from '../component/Contacts/IOContact';
import CourtesyContacts from '../component/Contacts/CourtesyContacts';
import SpecialContacts from '../component/Contacts/SpecialContacts';
import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';
import { PROFILO } from '../navigation/routes.const';
import { CourtesyChannelType } from '../models/contacts';
import { FAQ_WHAT_IS_AAR, FAQ_WHAT_IS_COURTESY_MESSAGE } from '../navigation/externalRoutes.const';
import { getConfiguration } from '../services/configuration.service';

const Contacts = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const recipientId = useAppSelector((state: RootState) => state.userState.user.uid);
  const digitalAddresses = useAppSelector(
    (state: RootState) => state.contactsState.digitalAddresses
  );
  const [pageReady, setPageReady] = useState(false);
  const { LANDING_SITE_URL } = getConfiguration();

  const contactIO = digitalAddresses.courtesy
    ? digitalAddresses.courtesy.find((address) => address.channelType === CourtesyChannelType.IOMSG)
    : null;

  const fetchAddresses = useCallback(() => {
    void dispatch(getDigitalAddresses(recipientId)).then(() => {
      setPageReady(true);
    });
  }, []);

  useEffect(() => {
    fetchAddresses();
    return () => void dispatch(resetState());
  }, []);

  const handleRedirectToProfilePage = () => {
    navigate(PROFILO);
  };

  const faqWhatIsAarCompleteLink = useMemo(
    () =>
      LANDING_SITE_URL && FAQ_WHAT_IS_AAR ? `${LANDING_SITE_URL}${FAQ_WHAT_IS_AAR}` : undefined,
    []
  );

  const faqWhatIsCourtesyMessageCompleteLink = useMemo(
    () =>
      LANDING_SITE_URL && FAQ_WHAT_IS_COURTESY_MESSAGE
        ? `${LANDING_SITE_URL}${FAQ_WHAT_IS_COURTESY_MESSAGE}`
        : undefined,
    []
  );

  const subtitle = (
    <>
      {t('subtitle-text-1', { ns: 'recapiti' })}
      {faqWhatIsAarCompleteLink ? (
        <Link href={faqWhatIsAarCompleteLink} target="_blank">
          {t('subtitle-link-1', { ns: 'recapiti' })}
        </Link>
      ) : (
        t('subtitle-link-1', { ns: 'recapiti' })
      )}
      {t('subtitle-text-2', { ns: 'recapiti' })}
      {faqWhatIsCourtesyMessageCompleteLink ? (
        <Link href={faqWhatIsCourtesyMessageCompleteLink} target="_blank">
          {t('subtitle-link-2', { ns: 'recapiti' })}
        </Link>
      ) : (
        t('subtitle-link-2', { ns: 'recapiti' })
      )}
      {t('subtitle-text-3', { ns: 'recapiti' })}
      <Link onClick={handleRedirectToProfilePage}>{t('subtitle-link-3', { ns: 'recapiti' })}</Link>
      {t('subtitle-text-4', { ns: 'recapiti' })}
    </>
  );

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <DigitalContactsCodeVerificationProvider>
        <Box p={3}>
          <TitleBox
            variantTitle="h4"
            title={t('title')}
            subTitle={subtitle}
            variantSubTitle={'body1'}
          />
          <ApiErrorWrapper
            apiId={CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES}
            reloadAction={fetchAddresses}
            mt={2}
          >
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
          </ApiErrorWrapper>
        </Box>
      </DigitalContactsCodeVerificationProvider>
    </LoadingPageWrapper>
  );
};

export default Contacts;
