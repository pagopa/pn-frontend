import { Trans, useTranslation } from 'react-i18next';

import { Box, List, ListItem, Stack, Typography } from '@mui/material';

import EmailContactItem from './EmailContactItem';
import SmsContactItem from './SmsContactItem';

const CourtesyContacts: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);

  const courtesyContactList: Array<string> = t('courtesy-contacts.list', {
    returnObjects: true,
    defaultValue: [],
    ns: 'recapiti',
  });

  return (
    <Box id="courtesyContactsSection">
      <Typography variant="h6" fontWeight={700} tabIndex={-1} id="courtesyContactsTitle">
        {t('courtesy-contacts.title', { ns: 'recapiti' })}
      </Typography>
      <List dense sx={{ py: 0, px: 3, mt: 2, listStyleType: 'square' }}>
        {courtesyContactList.map((item, index) => (
          <ListItem key={index} sx={{ display: 'list-item', p: 0, pt: index > 0 ? 1 : 0 }}>
            <Trans i18nKey={item} t={(s: string) => s} />
          </ListItem>
        ))}
      </List>
      <Stack spacing={3} mt={3} data-testid="courtesyContacts">
        <EmailContactItem />
        <SmsContactItem />
      </Stack>
    </Box>
  );
};

export default CourtesyContacts;
