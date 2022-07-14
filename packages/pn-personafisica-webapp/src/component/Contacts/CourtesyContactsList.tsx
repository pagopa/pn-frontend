import { useMemo } from 'react';
import { Stack } from '@mui/material';

import { CourtesyChannelType, DigitalAddress } from '../../models/contacts';
import CourtesyContactItem, { CourtesyFieldType } from './CourtesyContactItem';

interface Props {
  recipientId: string;
  contacts: Array<DigitalAddress>;
}

const CourtesyContactsList: React.FC<Props> = ({ recipientId, contacts }) => {
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

  return (
    <Stack spacing={3} mt={3}>
      <CourtesyContactItem
        recipientId={recipientId}
        type={CourtesyFieldType.PHONE}
        value={phoneContact ? phoneContact?.value : ''}
      />
      <CourtesyContactItem
        recipientId={recipientId}
        type={CourtesyFieldType.EMAIL}
        value={emailContact ? emailContact.value : ''}
      />
    </Stack>
  );
};

export default CourtesyContactsList;
