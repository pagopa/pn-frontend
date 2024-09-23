import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Link, Stack } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import ContactsSummaryCards from '../components/Contacts/ContactsSummaryCards';
import CourtesyContacts from '../components/Contacts/CourtesyContacts';
import LegalContacts from '../components/Contacts/LegalContacts';
import SpecialContacts from '../components/Contacts/SpecialContacts';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { PFEventsType } from '../models/PFEventsType';
import { FAQ_WHAT_IS_AAR, FAQ_WHAT_IS_COURTESY_MESSAGE } from '../navigation/externalRoutes.const';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { contactsSelectors, resetState } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getConfiguration } from '../services/configuration.service';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const Contacts = () => {
  const { t } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const addressesData = useAppSelector(contactsSelectors.selectAddresses);
  const [pageReady, setPageReady] = useState(false);
  const { LANDING_SITE_URL } = getConfiguration();

  const showSpecialContactsSection = addressesData.legalAddresses.length > 0;

  const fetchAddresses = useCallback(() => {
    void dispatch(getDigitalAddresses()).then(() => {
      setPageReady(true);
    });
  }, []);

  useEffect(() => {
    fetchAddresses();
    return () => void dispatch(resetState());
  }, []);

  useEffect(() => {
    if (pageReady) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_YOUR_CONTACT_DETAILS, {
        digitalAddresses: addressesData.addresses,
        contactIO: addressesData.defaultAPPIOAddress,
      });
    }
  }, [pageReady]);

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

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
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
          <Stack direction="column" spacing={6}>
            <Box>
              <LegalContacts />
              {showSpecialContactsSection && <SpecialContacts />}
            </Box>
            <CourtesyContacts />
          </Stack>
        </ApiErrorWrapper>
      </Box>
    </LoadingPageWrapper>
  );
};

export default Contacts;
