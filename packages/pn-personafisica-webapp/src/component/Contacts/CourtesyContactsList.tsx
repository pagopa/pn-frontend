import { Box, Divider, Grid } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { CourtesyChannelType, DigitalAddress } from '../../models/contacts';
import CourtesyContactItem, { CourtesyFieldType } from './CourtesyContactItem';

interface Props {
  recipientId: string;
  contacts: Array<DigitalAddress>;
};

const CourtesyContactsList: React.FC<Props> = ({recipientId, contacts}) => {
  const isMobile = useIsMobile();

  const phoneContacts = contacts.filter(
    (contact) => contact.channelType === CourtesyChannelType.SMS && contact.senderId === 'default'
  );
  const emailContacts = contacts.filter(
    (contact) => contact.channelType === CourtesyChannelType.EMAIL && contact.senderId === 'default'
  );


  return (
    <Box style={{ padding: '1rem' }}>
      <Grid container direction="row" sx={{ my: '1rem' }} spacing={2}>
        {phoneContacts.length > 0 ? (
          phoneContacts.map((contact) => (
            <CourtesyContactItem
              key={contact.value}
              recipientId={recipientId}
              type={CourtesyFieldType.PHONE}
              value={contact.value}
              isVerified={true}
            />
          ))
        ) : (
          <CourtesyContactItem 
          recipientId={recipientId} type={CourtesyFieldType.PHONE} value="" isVerified={false} />
        )}
      </Grid>
      {isMobile && <Divider />}
      <Grid container direction="row" sx={{ my: '1rem' }} spacing={2}>
        {emailContacts.length > 0 ? (
          emailContacts.map((contact) => (
            <CourtesyContactItem
              key={contact.value}
              recipientId={recipientId}
              type={CourtesyFieldType.EMAIL}
              value={contact.value}
              isVerified={true}
            />
          ))
        ) : (
          <CourtesyContactItem recipientId={recipientId} type={CourtesyFieldType.EMAIL} value="" isVerified={false} />
        )}
      </Grid>
    </Box>
  );
};

export default CourtesyContactsList;
