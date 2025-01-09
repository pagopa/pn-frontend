import { Trans, useTranslation } from 'react-i18next';

import { Alert, Box, Divider, Stack, Typography } from '@mui/material';

import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import PecContactItem from './PecContactItem';
import SercqSendContactItem from './SercqSendContactItem';

const LegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const {
    defaultPECAddress,
    defaultSERCQ_SENDAddress,
    specialPECAddresses,
    specialSERCQ_SENDAddresses,
  } = useAppSelector(contactsSelectors.selectAddresses);
  const { IS_DOD_ENABLED } = getConfiguration();

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

  const message = hasDodEnabledAndValidatingPec
    ? 'legal-contacts.pec-validation-banner.dod-enabled-message'
    : 'legal-contacts.pec-validation-banner.dod-disabled-message';

  return (
    <Box id="legalContactsSection">
      <Typography variant="h6" fontWeight={700} tabIndex={-1} id="legalContactsTitle" mb={2}>
        {t('legal-contacts.title', { ns: 'recapiti' })}
      </Typography>
      <Typography variant="body1">
        <Trans i18nKey="legal-contacts.sub-title" ns="recapiti" />
      </Typography>
      {verifyingPecAddress && (
        <Alert data-testid="PecVerificationAlert" severity="info" sx={{ mt: 4 }}>
          <Typography variant="inherit" sx={{ fontWeight: '600' }}>
            {t('legal-contacts.pec-validation-banner.title', { ns: 'recapiti' })}
          </Typography>
          <Typography variant="inherit">{t(message, { ns: 'recapiti' })}</Typography>
        </Alert>
      )}
      <Stack
        direction={defaultPECAddress?.pecValid ? 'column-reverse' : 'column'}
        spacing={(!defaultSERCQ_SENDAddress && !defaultPECAddress) || verifyingPecAddress ? 2 : 0}
        mt={4}
        data-testid="legalContacts"
      >
        {IS_DOD_ENABLED && <SercqSendContactItem />}
        {IS_DOD_ENABLED && !defaultSERCQ_SENDAddress && !defaultPECAddress && (
          <Divider>{t('conjunctions.or')}</Divider>
        )}
        <PecContactItem />
      </Stack>
    </Box>
  );
};

export default LegalContacts;
