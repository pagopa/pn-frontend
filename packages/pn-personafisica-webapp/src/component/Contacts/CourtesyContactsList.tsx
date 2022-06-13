import { useMemo } from 'react';
import { Box, Divider } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';

import { CourtesyChannelType, DigitalAddress } from '../../models/contacts';
import CourtesyContactItem, { CourtesyFieldType } from './CourtesyContactItem';

interface Props {
  recipientId: string;
  contacts: Array<DigitalAddress>;
}

const CourtesyContactsList: React.FC<Props> = ({ recipientId, contacts }) => {
  const isMobile = useIsMobile();

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
    <Box style={{ padding: '1rem 0' }}>
      <CourtesyContactItem
        recipientId={recipientId}
        type={CourtesyFieldType.PHONE}
        value={phoneContact ? phoneContact?.value : ''}
      />
      {(isMobile || phoneContact) && <Divider />}
      <CourtesyContactItem
        recipientId={recipientId}
        type={CourtesyFieldType.EMAIL}
        value={emailContact ? emailContact.value : ''}
      />
    </Box>
  );
};

export default CourtesyContactsList;
