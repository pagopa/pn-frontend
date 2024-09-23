import { Trans, useTranslation } from 'react-i18next';

import { Box, Stack, Typography } from '@mui/material';

import EmailContactItem from './EmailContactItem';
import SmsContactItem from './SmsContactItem';

const CourtesyContacts: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);

  return (
    <Box id="courtesyContactsSection">
      <Typography variant="h6" fontWeight={700} tabIndex={-1} id="courtesyContactsTitle" mb={2}>
        {t('courtesy-contacts.title', { ns: 'recapiti' })}
      </Typography>
      <Typography variant="body1">
        <Trans i18nKey="courtesy-contacts.sub-title" ns="recapiti" />
      </Typography>
      <Stack spacing={3} mt={4} data-testid="courtesyContacts">
        <EmailContactItem />
        <SmsContactItem />
      </Stack>
    </Box>
  );
};

export default CourtesyContacts;
