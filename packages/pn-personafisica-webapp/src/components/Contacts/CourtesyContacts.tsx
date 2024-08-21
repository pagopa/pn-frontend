import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, List, ListItem, Stack, Typography } from '@mui/material';

import { ChannelType, DigitalAddress } from '../../models/contacts';
import { countContactsByType } from '../../utility/contacts.utility';
import EmailContactItem from './EmailContactItem';
import IOContact from './IOContact';
import SmsContactItem from './SmsContactItem';

interface Props {
  contacts: Array<DigitalAddress>;
}

const CourtesyContacts: React.FC<Props> = ({ contacts }) => {
  const { t } = useTranslation(['common', 'recapiti']);

  const phoneContact = contacts.find(
    (contact) => contact.channelType === ChannelType.SMS && contact.senderId === 'default'
  );
  const emailContact = contacts.find(
    (contact) => contact.channelType === ChannelType.EMAIL && contact.senderId === 'default'
  );
  const contactIO = contacts.find((address) => address.channelType === ChannelType.IOMSG);

  const courtesyContactList: Array<string> = t('courtesy-contacts.list', {
    returnObjects: true,
    defaultValue: [],
    ns: 'recapiti',
  });

  const phoneContactsQuantity = (): number => countContactsByType(contacts, ChannelType.SMS);

  const emailContactsQuantity = (): number => countContactsByType(contacts, ChannelType.EMAIL);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700}>
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
        <IOContact contact={contactIO} />
        <EmailContactItem
          value={emailContact?.value ?? ''}
          blockDelete={emailContactsQuantity() > 1}
        />
        <SmsContactItem
          value={phoneContact?.value ?? ''}
          blockDelete={phoneContactsQuantity() > 1}
        />
      </Stack>
    </Box>
  );
};

export default CourtesyContacts;
