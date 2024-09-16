import { Trans, useTranslation } from 'react-i18next';

import { Box, Divider, Stack, Typography } from '@mui/material';

import PecContactItem from './PecContactItem';
import SercqSendContactItem from './SercqSendContactItem';

const LegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);

  return (
    <Box id="legalContactsSection">
      <Typography variant="h6" fontWeight={700} tabIndex={-1} id="legalContactsTitle" mb={2}>
        {t('legal-contacts.title', { ns: 'recapiti' })}
      </Typography>
      <Typography variant="body1">
        <Trans i18nKey="legal-contacts.sub-title" ns="recapiti" />
      </Typography>
      <Stack spacing={0} mt={4} data-testid="legalContacts">
        <SercqSendContactItem />
        <Divider sx={{ color: 'text.secondary', my: 2 }}>{t('conjunctions.or')}</Divider>
        <PecContactItem />
      </Stack>
    </Box>
  );
};

export default LegalContacts;
