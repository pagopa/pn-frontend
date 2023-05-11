import { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Link, Stack, Typography } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { resetState } from '../redux/contact/reducers';
import { RootState } from '../redux/store';
import { DigitalContactsCodeVerificationProvider } from '../component/Contacts/DigitalContactsCodeVerification.context';
import InsertLegalContact from '../component/Contacts/InsertLegalContact';
import LegalContactsList from '../component/Contacts/LegalContactsList';
import CourtesyContacts from '../component/Contacts/CourtesyContacts';
import SpecialContacts from '../component/Contacts/SpecialContacts';
import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';
import { PROFILE } from '../navigation/routes.const';

const Contacts = () => {
  const { t } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const recipientId = useAppSelector((state: RootState) => state.userState.user.uid);
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
  const profileUrl = PROFILE(organization?.id);
  const digitalAddresses = useAppSelector(
    (state: RootState) => state.contactsState.digitalAddresses
  );
  const [pageReady, setPageReady] = useState(false);

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
    if (profileUrl) {
      window.open(profileUrl);
    }
  };

  const subtitle = (
    <>
      {t('subtitle-1', { ns: 'recapiti', recipient: organization.name })}
      <Link
        color="primary"
        fontWeight={'bold'}
        onClick={handleRedirectToProfilePage}
        sx={{ cursor: 'pointer' }}
      >
        {t('subtitle-link', { ns: 'recapiti' })}
      </Link>
      {t('subtitle-2', { ns: 'recapiti' })}
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
                  <Box sx={{ width: '100%' }}>
                    {digitalAddresses.legal.length === 0 ? (
                      <InsertLegalContact recipientId={recipientId} />
                    ) : (
                      <LegalContactsList
                        recipientId={recipientId}
                        legalAddresses={digitalAddresses.legal}
                      />
                    )}
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
