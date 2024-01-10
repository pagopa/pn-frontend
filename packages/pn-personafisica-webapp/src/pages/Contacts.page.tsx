import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Link, Stack, Typography } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import CourtesyContacts from '../components/Contacts/CourtesyContacts';
import { DigitalContactsCodeVerificationProvider } from '../components/Contacts/DigitalContactsCodeVerification.context';
import IOContact from '../components/Contacts/IOContact';
import InsertLegalContact from '../components/Contacts/InsertLegalContact';
import LegalContactsList from '../components/Contacts/LegalContactsList';
import SpecialContacts from '../components/Contacts/SpecialContacts';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { CourtesyChannelType, DigitalAddress, IOAllowedValues } from '../models/contacts';
import { FAQ_WHAT_IS_AAR, FAQ_WHAT_IS_COURTESY_MESSAGE } from '../navigation/externalRoutes.const';
import { PROFILO } from '../navigation/routes.const';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { resetState } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import { TrackEventType } from '../utility/events';
import { trackEventByType } from '../utility/mixpanel';

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

  useEffect(() => {
    if (pageReady) {
      trackEventByType(TrackEventType.SEND_YOUR_CONTACT_DETAILS, {
        PEC_exists: digitalAddresses.legal.length > 0,
        email_exists:
          digitalAddresses.courtesy.filter((c) => c.channelType === CourtesyChannelType.EMAIL)
            .length > 0,
        telephone_exists:
          digitalAddresses.courtesy.filter((c) => c.channelType === CourtesyChannelType.SMS)
            .length > 0,
        appIO_status: contactIO
          ? contactIO.value === IOAllowedValues.ENABLED
            ? 'activated'
            : 'deactivated'
          : 'nd',
      });
    }
  }, [pageReady]);

  const handleRedirectToProfilePage = () => {
    trackEventByType(TrackEventType.SEND_VIEW_PROFILE, { source: 'tuoi_recapiti' });
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
        <Link
          href={faqWhatIsAarCompleteLink}
          target="_blank"
          aria-label={t('subtitle-link-1', { ns: 'recapiti' })}
        >
          {t('subtitle-link-1', { ns: 'recapiti' })}
        </Link>
      ) : (
        t('subtitle-link-1', { ns: 'recapiti' })
      )}
      {t('subtitle-text-2', { ns: 'recapiti' })}
      {faqWhatIsCourtesyMessageCompleteLink ? (
        <Link
          href={faqWhatIsCourtesyMessageCompleteLink}
          target="_blank"
          aria-label={t('subtitle-link-2', { ns: 'recapiti' })}
        >
          {t('subtitle-link-2', { ns: 'recapiti' })}
        </Link>
      ) : (
        t('subtitle-link-2', { ns: 'recapiti' })
      )}
      {t('subtitle-text-3', { ns: 'recapiti' })}
      <Link
        onClick={handleRedirectToProfilePage}
        tabIndex={0}
        aria-label={t('subtitle-link-3', { ns: 'recapiti' })}
      >
        {t('subtitle-link-3', { ns: 'recapiti' })}
      </Link>
      {t('subtitle-text-4', { ns: 'recapiti' })}
    </>
  );

  const courtesyContactsNotEmpty = () => {
    const isIrrilevant = (address: DigitalAddress) =>
      address.channelType === CourtesyChannelType.IOMSG;
    return digitalAddresses.courtesy.some((addr) => !isIrrilevant(addr));
  };

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <DigitalContactsCodeVerificationProvider>
        <Box p={3}>
          <TitleBox
            variantTitle="h4"
            title={t('title')}
            subTitle={subtitle}
            variantSubTitle={'body1'}
            ariaLabel={t('title')}
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
              {(digitalAddresses.legal.length > 0 || courtesyContactsNotEmpty()) && (
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
