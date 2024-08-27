import { Trans, useTranslation } from 'react-i18next';

import { Box, Divider, List, ListItem, Stack, Typography } from '@mui/material';

import { ChannelType, DigitalAddress } from '../../models/contacts';
import PecContactItem from './PecContactItem';
import SercqSendContactItem from './SercqSendContactItem';

type Props = {
  legalAddresses: Array<DigitalAddress>;
};

const LegalContacts = ({ legalAddresses }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);

  const pecAddress = legalAddresses.find(
    (a) => a.senderId === 'default' && a.channelType === ChannelType.PEC
  );

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
        <SercqSendContactItem
          value={
            legalAddresses.find(
              (a) => a.senderId === 'default' && a.channelType === ChannelType.SERCQ
            )?.value ?? ''
          }
        />
        <Divider sx={{ backgroundColor: 'white', color: 'text.secondary' }}>
          {t('conjunctions.or')}
        </Divider>
        <PecContactItem
          value={
            legalAddresses.find(
              (a) => a.senderId === 'default' && a.channelType === ChannelType.PEC
            )?.value ?? ''
          }
          blockDelete={legalAddresses.some(
            (addr) => addr.channelType === ChannelType.PEC && addr.senderId !== 'default'
          )}
          verifyingAddress={pecAddress ? !pecAddress.pecValid : false}
        />
      </Stack>
    </Box>
  );
};

export default LegalContacts;
