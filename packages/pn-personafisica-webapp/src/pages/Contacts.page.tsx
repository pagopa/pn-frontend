import { useCallback, useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Link, Stack } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import CourtesyContacts from '../components/Contacts/CourtesyContacts';
import LegalContacts from '../components/Contacts/LegalContacts';
import ValidatingPecBanner from '../components/Contacts/ValidatingPecBanner';
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

const Contacts = () => {
  const { t } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const { defaultAPPIOAddress, addresses } = useAppSelector(contactsSelectors.selectAddresses);
  const { LANDING_SITE_URL } = getConfiguration();

  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);

  const SendYourContactDetailsEvent = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_YOUR_CONTACT_DETAILS, {
      digitalAddresses: addresses,
      contactIO: defaultAPPIOAddress,
    });
  };

  useEffect(() => {
    SendYourContactDetailsEvent();
  }, []);

  const fetchAddresses = useCallback(() => {
    void dispatch(getDigitalAddresses())
      .unwrap()
      .then(() => {
        SendYourContactDetailsEvent();
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
    if (externalEvent) {
      if (externalEvent.operation === ContactOperation.SCROLL) {
        goToSection(externalEvent.destination);
      }
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
