import { Trans, useTranslation } from 'react-i18next';

import { Alert, Box, Divider, Stack, Typography } from '@mui/material';

import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import { ChannelType } from '../../models/contacts';
import PecContactItem from './PecContactItem';
import SercqSendContactItem from './SercqSendContactItem';

const LegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { defaultSERCQ_SENDAddress, defaultPECAddress, addresses } = useAppSelector(contactsSelectors.selectAddresses);
  const { DOD_DISABLED } = getConfiguration();

  const hasPartyDodEnabledAndValidatingPec = addresses.some(address_1 => 
    address_1.channelType === ChannelType.PEC && 
    !address_1.pecValid &&
    addresses.some(address_2 =>
      address_2.channelType === ChannelType.SERCQ_SEND &&
      address_2.senderId === address_1.senderId
    )
  );

  const hasValidatingPecSpecialContact = addresses.some(address => address.channelType === ChannelType.PEC && !address.pecValid);
  
  const verifyingPecAddress = defaultPECAddress && !defaultPECAddress.pecValid || hasValidatingPecSpecialContact;

  const message = hasPartyDodEnabledAndValidatingPec ? "legal-contacts.pec-validation-banner.dod-enabled-message" : "legal-contacts.pec-validation-banner.dod-disabled-message";

  return (
    <Box id="legalContactsSection">
      <Typography variant="h6" fontWeight={700} tabIndex={-1} id="legalContactsTitle" mb={2}>
        {t('legal-contacts.title', { ns: 'recapiti' })}
      </Typography>
      <Typography variant="body1">
        <Trans i18nKey="legal-contacts.sub-title" ns="recapiti" />
      </Typography>
      {verifyingPecAddress &&
        <Alert data-testid="PecVerificationAlert" severity="info" sx={{ mt: 4 }}>
          <Typography variant="inherit" sx={{ fontWeight: '600' }}>
            { t('legal-contacts.pec-validation-banner.title', { ns: 'recapiti'}) }
          </Typography>
          <Typography variant="inherit">
            { t(message, { ns: 'recapiti'}) }
          </Typography>
        </Alert>
      }
      <Stack spacing={!defaultSERCQ_SENDAddress ? 2 : 0} mt={4} data-testid="legalContacts">
        {!DOD_DISABLED && <SercqSendContactItem />}
        {!DOD_DISABLED && !defaultSERCQ_SENDAddress && <Divider>{t('conjunctions.or')}</Divider>}
        <PecContactItem />
      </Stack>
    </Box>
  );
};

export default LegalContacts;
