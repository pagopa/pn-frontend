import { useCallback, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Link, Stack } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import CourtesyContacts from '../components/Contacts/CourtesyContacts';
import LegalContacts from '../components/Contacts/LegalContacts';
import ValidatingPecBanner from '../components/Contacts/ValidatingPecBanner';
import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { ChannelType, ContactOperation, ContactSource } from '../models/contacts';
import { PROFILE } from '../navigation/routes.const';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { resetExternalEvent } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const Contacts = () => {
  const { t, i18n } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();

  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);

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
