import { Box, Divider, Grid } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { CourtesyChannelType } from '../../models/contacts';
import CourtesyContactItem, { CourtesyFieldType } from './CourtesyContactItem';
import { DigitalContactsCodeVerificationProvider } from './DigitalContactsCodeVerification.context';

const CourtesyContactsList = () => {
  const isMobile = useIsMobile();
  const courtesyContacts = useAppSelector(
    (state: RootState) => state.contactsState.digitalAddresses.courtesy
  );

  const phoneContacts = courtesyContacts.filter(
    (contact) => contact.channelType === CourtesyChannelType.SMS && contact.senderId === 'default'
  );
  const emailContacts = courtesyContacts.filter(
    (contact) => contact.channelType === CourtesyChannelType.EMAIL && contact.senderId === 'default'
  );

  return (
    <DigitalContactsCodeVerificationProvider>
      <Box style={{ padding: '1rem' }}>
        <Grid container direction="row" sx={{ my: '1rem' }} spacing={2}>
          {phoneContacts.length > 0 ? (
            phoneContacts.map((contact) => (
              <CourtesyContactItem
                key={contact.value}
                type={CourtesyFieldType.PHONE}
                value={contact.value}
                isVerified={true}
              />
            ))
          ) : (
            <CourtesyContactItem type={CourtesyFieldType.PHONE} value="" isVerified={false} />
          )}
        </Grid>
        {isMobile && <Divider />}
        <Grid container direction="row" sx={{ my: '1rem' }} spacing={2}>
          {emailContacts.length > 0 ? (
            emailContacts.map((contact) => (
              <CourtesyContactItem
                key={contact.value}
                type={CourtesyFieldType.EMAIL}
                value={contact.value}
                isVerified={true}
              />
            ))
          ) : (
            <CourtesyContactItem type={CourtesyFieldType.EMAIL} value="" isVerified={false} />
          )}
        </Grid>
      </Box>
    </DigitalContactsCodeVerificationProvider>
  );
};

export default CourtesyContactsList;
