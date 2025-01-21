import { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Alert, Box, Link, Stack, Typography } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import ContactsSummaryCards from '../components/Contacts/ContactsSummaryCards';
import CourtesyContacts from '../components/Contacts/CourtesyContacts';
import LegalContacts from '../components/Contacts/LegalContacts';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { PROFILE } from '../navigation/routes.const';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const Contacts = () => {
  const { t, i18n } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const {
    defaultPECAddress,
    defaultSERCQ_SENDAddress,
    specialPECAddresses,
    specialSERCQ_SENDAddresses,
  } = useAppSelector(contactsSelectors.selectAddresses);
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
  const profileUrl = PROFILE(organization?.id, i18n.language);

  const fetchAddresses = useCallback(() => {
    void dispatch(getDigitalAddresses());
  }, []);

  const handleRedirectToProfilePage = () => {
    if (profileUrl) {
      window.open(profileUrl);
    }
  };

  const subtitle = (
    <Trans
      i18nKey="subtitle"
      ns="recapiti"
      values={{ recipient: organization.name }}
      components={[
        <Link
          key="profilePageLink"
          color="primary"
          fontWeight="bold"
          onClick={handleRedirectToProfilePage}
          sx={{ verticalAlign: 'inherit' }}
          component="button"
        />,
      ]}
    ></Trans>
  );

  const hasDodEnabledAndValidatingPec =
    (!defaultPECAddress?.pecValid && defaultSERCQ_SENDAddress) ||
    specialSERCQ_SENDAddresses.some((sercqAddr) =>
      specialPECAddresses.some(
        (pecAddr) => !pecAddr.pecValid && pecAddr.senderId === sercqAddr.senderId
      )
    );

  const hasValidatingPecSpecialContact = specialPECAddresses.some((address) => !address.pecValid);

  const verifyingPecAddress =
    (defaultPECAddress && !defaultPECAddress.pecValid) || hasValidatingPecSpecialContact;

  const bannerMessage = hasDodEnabledAndValidatingPec
    ? 'legal-contacts.pec-validation-banner.dod-enabled-message'
    : 'legal-contacts.pec-validation-banner.dod-disabled-message';

  return (
    <LoadingPageWrapper isInitialized={true}>
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
        >
          <ContactsSummaryCards />
          {verifyingPecAddress && (
            <Alert data-testid="PecVerificationAlert" severity="info" sx={{ my: { xs: 2, lg: 4 } }}>
              <Typography variant="inherit" sx={{ fontWeight: '600' }}>
                {t('legal-contacts.pec-validation-banner.title', { ns: 'recapiti' })}
              </Typography>
              <Typography variant="inherit">{t(bannerMessage, { ns: 'recapiti' })}</Typography>
            </Alert>
          )}
          <Stack direction="column" spacing={6}>
            <LegalContacts />
            <CourtesyContacts />
          </Stack>
        </ApiErrorWrapper>
      </Box>
    </LoadingPageWrapper>
  );
};

export default Contacts;
