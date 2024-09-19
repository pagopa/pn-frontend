import { Trans, useTranslation } from 'react-i18next';

import { Box, Divider, List, ListItem, Typography } from '@mui/material';

import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import PecContactItem from './PecContactItem';
import SercqSendContactItem from './SercqSendContactItem';

const LegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { defaultSERCQAddress, defaultPECAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );

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
      <Box
        data-testid="legalContacts"
        mt={3}
        display="flex"
        flexDirection={!defaultSERCQAddress && defaultPECAddress ? 'column-reverse' : 'column'}
      >
        <SercqSendContactItem />
        {!defaultSERCQAddress && (
          <>
            <Divider sx={{ color: 'text.secondary', my: 2 }}>{t('conjunctions.or')}</Divider>
            <PecContactItem />
          </>
        )}
      </Box>
    </Box>
  );
};

export default LegalContacts;
