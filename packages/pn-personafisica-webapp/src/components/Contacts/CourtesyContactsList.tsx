import { useMemo } from 'react';

import { Stack } from '@mui/material';

import { CourtesyChannelType, DigitalAddress } from '../../models/contacts';
import { countContactsByType } from '../../utility/contacts.utility';
import CourtesyContactItem, { CourtesyFieldType } from './CourtesyContactItem';

interface Props {
  contacts: Array<DigitalAddress>;
}

const CourtesyContactsList: React.FC<Props> = ({ contacts }) => {
  const phoneContact = useMemo(
    () =>
      contacts.find(
        (contact) =>
          contact.channelType === CourtesyChannelType.SMS && contact.senderId === 'default'
      ),
    [contacts]
  );

  const emailContact = useMemo(
    () =>
      contacts.find(
        (contact) =>
          contact.channelType === CourtesyChannelType.EMAIL && contact.senderId === 'default'
      ),
    [contacts]
  );

  const phoneContactsQuantity = useMemo(
    () => countContactsByType(contacts, CourtesyChannelType.SMS),
    [contacts]
  );

  const emailContactsQuantity = useMemo(
    () => countContactsByType(contacts, CourtesyChannelType.EMAIL),
    [contacts]
  );

  return (
    <Stack spacing={3} mt={3}>
      <CourtesyContactItem
        type={CourtesyFieldType.EMAIL}
        value={emailContact?.value ? emailContact.value : ''}
        blockDelete={emailContactsQuantity > 1}
      />
      <CourtesyContactItem
        type={CourtesyFieldType.PHONE}
        value={phoneContact?.value ? phoneContact.value : ''}
        blockDelete={phoneContactsQuantity > 1}
      />
    </Stack>
  );
};

export default CourtesyContactsList;
