import { Trans, useTranslation } from 'react-i18next';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import PecContactItem from './PecContactItem';
import SercqSendContactItem from './SercqSendContactItem';

const LegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { defaultSERCQ_SENDAddress } = useAppSelector(contactsSelectors.selectAddresses);

  return (
    <Box id="legalContactsSection">
      <Typography variant="h6" fontWeight={700} tabIndex={-1} id="legalContactsTitle" mb={2}>
        {t('legal-contacts.title', { ns: 'recapiti' })}
      </Typography>
      <Typography variant="body1">
        <Trans i18nKey="legal-contacts.sub-title" ns="recapiti" />
      </Typography>
      <Stack spacing={!defaultSERCQ_SENDAddress ? 2 : 0} mt={3} data-testid="legalContacts">
        <SercqSendContactItem />
        {!defaultSERCQ_SENDAddress && (
          <Divider sx={{ color: 'text.secondary' }}>{t('conjunctions.or')}</Divider>
        )}
        <PecContactItem />
      </Stack>
    </Box>
  );
};

export default LegalContacts;
