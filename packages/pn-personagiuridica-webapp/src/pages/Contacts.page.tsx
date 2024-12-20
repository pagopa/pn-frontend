import { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Link, Stack } from '@mui/material';
import { ApiErrorWrapper, TitleBox } from '@pagopa-pn/pn-commons';

import ContactsSummaryCards from '../components/Contacts/ContactsSummaryCards';
import CourtesyContacts from '../components/Contacts/CourtesyContacts';
import LegalContacts from '../components/Contacts/LegalContacts';
import SpecialContacts from '../components/Contacts/SpecialContacts';
import { PROFILE } from '../navigation/routes.const';
import { CONTACT_ACTIONS, getDigitalAddresses } from '../redux/contact/actions';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const Contacts = () => {
  const { t, i18n } = useTranslation(['recapiti']);
  const dispatch = useAppDispatch();
  const addressesData = useAppSelector(contactsSelectors.selectAddresses);
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
  const profileUrl = PROFILE(organization?.id, i18n.language);

  const showSpecialContactsSection = addressesData.specialAddresses.length > 0;

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

  return (
    <Box p={3}>
      <TitleBox
        variantTitle="h4"
        title={t('title')}
        subTitle={subtitle}
        variantSubTitle={'body1'}
      />
      <ApiErrorWrapper apiId={CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES} reloadAction={fetchAddresses}>
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
  );
};

export default Contacts;
