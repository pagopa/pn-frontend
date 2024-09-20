import { Trans, useTranslation } from 'react-i18next';

import { Box, Divider, List, ListItem, Stack, Typography } from '@mui/material';

import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import PecContactItem from './PecContactItem';
import SercqSendContactItem from './SercqSendContactItem';

const LegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { defaultSERCQAddress } = useAppSelector(contactsSelectors.selectAddresses);

  const legalContactList: Array<string> = t('legal-contacts.list', {
    returnObjects: true,
    defaultValue: [],
    ns: 'recapiti',
  });

  return (
    <Box id="legalContactsSection">
      <Typography variant="h6" fontWeight={700} tabIndex={-1} id="legalContactsTitle">
        {t('legal-contacts.title', { ns: 'recapiti' })}
      </Typography>
      <List dense sx={{ py: 0, px: 3, mt: 2, listStyleType: 'square' }}>
        {legalContactList.map((item, index) => (
          <ListItem key={index} sx={{ display: 'list-item', p: 0, pt: index > 0 ? 1 : 0 }}>
            <Trans i18nKey={item} t={(s: string) => s} />
          </ListItem>
        ))}
      </List>
      <Stack
        spacing={!defaultSERCQAddress ? 2 : 0}
        mt={3}
        data-testid="legalContacts"
        divider={
          !defaultSERCQAddress && (
            <Divider sx={{ color: 'text.secondary' }}>{t('conjunctions.or')}</Divider>
          )
        }
      >
        <SercqSendContactItem />
        <PecContactItem />
      </Stack>
    </Box>
  );
};

export default LegalContacts;
