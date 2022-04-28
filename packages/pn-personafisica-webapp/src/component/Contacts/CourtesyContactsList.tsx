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

  const phoneContact = contacts.find(
    (contact) => contact.channelType === CourtesyChannelType.SMS && contact.senderId === 'default'
  );
  const emailContact = contacts.find(
    (contact) => contact.channelType === CourtesyChannelType.EMAIL && contact.senderId === 'default'
  );

  return (
    <Box style={{ padding: '1rem' }}>
      {phoneContact ? (
        <CourtesyContactItem
          recipientId={recipientId}
          type={CourtesyFieldType.PHONE}
          value={phoneContact.value}
        />
      ) : (
        <CourtesyContactItem recipientId={recipientId} type={CourtesyFieldType.PHONE} value="" />
      )}
      {(isMobile || phoneContact) && <Divider />}
      {emailContact ? (
        <CourtesyContactItem
          recipientId={recipientId}
          type={CourtesyFieldType.EMAIL}
          value={emailContact.value}
        />
      ) : (
        <CourtesyContactItem recipientId={recipientId} type={CourtesyFieldType.EMAIL} value="" />
      )}
    </Box>
  );
};

export default CourtesyContactsList;
