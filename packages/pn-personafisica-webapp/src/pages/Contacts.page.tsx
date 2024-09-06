import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Divider, Link, Stack } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import CourtesyContacts from '../components/Contacts/CourtesyContacts';
import LegalContacts from '../components/Contacts/LegalContacts';
import SpecialContacts from '../components/Contacts/SpecialContacts';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { PFEventsType } from '../models/PFEventsType';
import { ChannelType, DigitalAddress } from '../models/contacts';
import { FAQ_WHAT_IS_AAR, FAQ_WHAT_IS_COURTESY_MESSAGE } from '../navigation/externalRoutes.const';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { contactsSelectors, resetState } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getConfiguration } from '../services/configuration.service';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const Contacts = () => {
  const { t } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const {
    addresses,
    courtesyAddresses,
    defaultPECAddress,
    defaultAPPIOAddress: contactIO,
  } = useAppSelector(contactsSelectors.selectAddresses);
  const [pageReady, setPageReady] = useState(false);
  const { LANDING_SITE_URL } = getConfiguration();

  const courtesyContactsNotEmpty = () => {
    const isIrrilevant = (address: DigitalAddress) => address.channelType === ChannelType.IOMSG;
    return courtesyAddresses.some((addr) => !isIrrilevant(addr));
  };

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
        digitalAddresses: addresses,
        contactIO,
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
          <Stack direction="column" spacing={4} mt={4}>
            <LegalContacts />
            <CourtesyContacts />
          </Stack>
          {(defaultPECAddress || courtesyContactsNotEmpty()) && (
            <>
              <Divider sx={{ backgroundColor: 'white', color: 'text.secondary', mt: 6, mb: 3 }} />
              <SpecialContacts />
            </>
          )}
        </ApiErrorWrapper>
      </Box>
    </LoadingPageWrapper>
  );
};

export default Contacts;
