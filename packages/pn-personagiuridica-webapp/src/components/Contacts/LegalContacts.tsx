import { Trans, useTranslation } from 'react-i18next';

import { Box, Divider, List, ListItem, Stack, Typography } from '@mui/material';

import PecContactItem from './PecContactItem';
import SercqSendContactItem from './SercqSendContactItem';

const LegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);

  const legalContactList: Array<string> = t('legal-contacts.list', {
    returnObjects: true,
    defaultValue: [],
    ns: 'recapiti',
  });

  return (
    <Box id="legalContactsSection">
      <Typography variant="h6" fontWeight={700}>
        {t('legal-contacts.title', { ns: 'recapiti' })}
      </Typography>
      <List dense sx={{ py: 0, px: 3, mt: 2, listStyleType: 'square' }}>
        {legalContactList.map((item, index) => (
          <ListItem key={index} sx={{ display: 'list-item', p: 0, pt: index > 0 ? 1 : 0 }}>
            <Trans i18nKey={item} t={(s: string) => s} />
          </ListItem>
        ))}
      </List>
      <Stack spacing={0} mt={3} data-testid="legalContacts">
        <SercqSendContactItem />
        <Divider sx={{ backgroundColor: 'white', color: 'text.secondary' }}>
          {t('conjunctions.or')}
        </Divider>
        <PecContactItem />
      </Stack>
    </Box>
  );
};

export default LegalContacts;
