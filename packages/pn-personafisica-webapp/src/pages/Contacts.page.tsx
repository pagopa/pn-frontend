import { useCallback, useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Alert, Box, Link, Stack, Typography } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import CourtesyContacts from '../components/Contacts/CourtesyContacts';
import LegalContacts from '../components/Contacts/LegalContacts';
import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { PFEventsType } from '../models/PFEventsType';
import { ChannelType, ContactOperation, ContactSource } from '../models/contacts';
import { FAQ_WHAT_IS_AAR, FAQ_WHAT_IS_COURTESY_MESSAGE } from '../navigation/externalRoutes.const';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { contactsSelectors, resetExternalEvent } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const ValidatingPecBanner: React.FC = () => {
  const { t } = useTranslation(['recapiti']);
  const {
    defaultPECAddress,
    defaultSERCQ_SENDAddress,
    specialPECAddresses,
    specialSERCQ_SENDAddresses,
  } = useAppSelector(contactsSelectors.selectAddresses);

  const isValidatingDefaultPec = defaultPECAddress?.pecValid === false;

  const isDefaultSercqSendActive = !!defaultSERCQ_SENDAddress;

  const validatingSpecialPecList: Array<string> = specialPECAddresses
    .filter(
      (pecAddr) =>
        pecAddr.pecValid === false &&
        (isDefaultSercqSendActive ||
          specialSERCQ_SENDAddresses.some((sercqAddr) => sercqAddr.senderId === pecAddr.senderId))
    )
    .map((addr) => addr.senderName ?? addr.senderId);

  // eslint-disable-next-line functional/no-let
  let bannerMessage = '';
  if (!isValidatingDefaultPec && validatingSpecialPecList.length === 0) {
    return;
  }
  if (isValidatingDefaultPec) {
    if (isDefaultSercqSendActive) {
      bannerMessage = 'dod-enabled-message';
    } else {
      bannerMessage = 'dod-disabled-message';
    }
  } else {
    bannerMessage = 'parties-list';
  }
  return (
    <Alert data-testid="PecVerificationAlert" severity="warning" sx={{ my: { xs: 2, lg: 4 } }}>
      <Typography variant="inherit" sx={{ fontWeight: '600' }}>
        {t('legal-contacts.pec-validation-banner.title')}
      </Typography>
      <Typography variant="inherit">
        {t(`legal-contacts.pec-validation-banner.${bannerMessage}`, {
          list: validatingSpecialPecList.join(', '),
        })}
      </Typography>
    </Alert>
  );
};

const Contacts = () => {
  const { t } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const { defaultAPPIOAddress, addresses } = useAppSelector(contactsSelectors.selectAddresses);
  const { LANDING_SITE_URL } = getConfiguration();

  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);

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

  const goToSection = (section: ChannelType) => {
    const sectionId = section === ChannelType.EMAIL ? 'emailContactSection' : 'ioContactSection';
    const titleId = section === ChannelType.EMAIL ? 'default_email' : 'ioContactButton';

    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById(titleId)?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (externalEvent && externalEvent.operation === ContactOperation.SCROLL) {
      goToSection(externalEvent.destination);
      dispatch(resetExternalEvent());
    }
  }, [externalEvent]);

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
          <ValidatingPecBanner />
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
