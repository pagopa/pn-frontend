import { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Alert, Box, Link, Stack, Typography } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import CourtesyContacts from '../components/Contacts/CourtesyContacts';
import LegalContacts from '../components/Contacts/LegalContacts';
import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { PFEventsType } from '../models/PFEventsType';
import { ContactSource } from '../models/contacts';
import { FAQ_WHAT_IS_AAR, FAQ_WHAT_IS_COURTESY_MESSAGE } from '../navigation/externalRoutes.const';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getConfiguration } from '../services/configuration.service';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const Contacts = () => {
  const { t } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const {
    defaultPECAddress,
    defaultAPPIOAddress,
    defaultSERCQ_SENDAddress,
    specialPECAddresses,
    specialSERCQ_SENDAddresses,
    addresses,
  } = useAppSelector(contactsSelectors.selectAddresses);
  const { LANDING_SITE_URL } = getConfiguration();

  const fetchAddresses = useCallback(() => {
    void dispatch(getDigitalAddresses())
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_YOUR_CONTACT_DETAILS, {
          digitalAddresses: addresses,
          contactIO: defaultAPPIOAddress,
        });
      });
  }, []);

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
    <Trans
      i18nKey="subtitle"
      ns="recapiti"
      components={[
        faqWhatIsAarCompleteLink ? (
          <Link key="whatIsAarLink" href={faqWhatIsAarCompleteLink} target="_blank" />
        ) : (
          <></>
        ),
        faqWhatIsCourtesyMessageCompleteLink ? (
          <Link
            key="courtesyMessageLink"
            href={faqWhatIsCourtesyMessageCompleteLink}
            target="_blank"
          />
        ) : (
          <></>
        ),
      ]}
    />
  );

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
          <DomicileBanner source={ContactSource.RECAPITI} />
          {verifyingPecAddress && (
            <Alert data-testid="PecVerificationAlert" severity="info" sx={{ my: { xs: 2, lg: 4 } }}>
              <Typography variant="inherit" sx={{ fontWeight: '600' }}>
                {t('legal-contacts.pec-validation-banner.title', { ns: 'recapiti' })}
              </Typography>
              <Typography variant="inherit">{t(bannerMessage, { ns: 'recapiti' })}</Typography>
            </Alert>
          )}
          <Stack direction="column" spacing={2} mt={2}>
            <LegalContacts />
            <CourtesyContacts />
          </Stack>
        </ApiErrorWrapper>
      </Box>
    </LoadingPageWrapper>
  );
};

export default Contacts;
