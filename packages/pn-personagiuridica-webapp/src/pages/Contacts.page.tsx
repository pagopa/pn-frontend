import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Link, Stack, Typography } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';
import { LangCode } from '@pagopa/mui-italia';

import CourtesyContacts from '../components/Contacts/CourtesyContacts';
import { DigitalContactsCodeVerificationProvider } from '../components/Contacts/DigitalContactsCodeVerification.context';
import InsertLegalContact from '../components/Contacts/InsertLegalContact';
import LegalContactsList from '../components/Contacts/LegalContactsList';
import SpecialContacts from '../components/Contacts/SpecialContacts';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { AddressType } from '../models/contacts';
import { PROFILE } from '../navigation/routes.const';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { resetState } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const Contacts = () => {
  const { t, i18n } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const currentLanguage = i18n.language as LangCode;
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
  const profileUrl = PROFILE(organization?.id, currentLanguage);
  const digitalAddresses = useAppSelector(
    (state: RootState) => state.contactsState.digitalAddresses
  );
  const legalAddresses = digitalAddresses.filter(
    (address) => address.addressType === AddressType.LEGAL
  );
  const courtesyAddresses = digitalAddresses.filter(
    (address) => address.addressType === AddressType.COURTESY
  );
  const [pageReady, setPageReady] = useState(false);

  const fetchAddresses = useCallback(() => {
    void dispatch(getDigitalAddresses()).then(() => {
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
        sx={{ verticalAlign: 'inherit' }}
        aria-label={t('subtitle-link', { ns: 'recapiti' })}
        component="button"
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
                    {legalAddresses.length === 0 ? (
                      <InsertLegalContact />
                    ) : (
                      <LegalContactsList legalAddresses={legalAddresses} />
                    )}
                  </Box>
                </Stack>
                <CourtesyContacts contacts={courtesyAddresses} />
              </Stack>
              {(legalAddresses.length > 0 || courtesyAddresses.length > 0) && (
                <Stack spacing={2}>
                  <Typography id="specialContactTitle" variant="h5" fontWeight={600} fontSize={28}>
                    {t('special-contacts-title')}
                  </Typography>
                  <SpecialContacts
                    legalAddresses={legalAddresses}
                    courtesyAddresses={courtesyAddresses}
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
