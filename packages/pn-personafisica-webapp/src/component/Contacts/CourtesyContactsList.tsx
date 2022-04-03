import { Box, Grid } from '@mui/material';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { CourtesyChannelType} from "../../models/contacts";
import CourtesyContactItem, { courtesyFieldType } from "./CourtesyContactItem";

const CourtesyContactsList = () => {
  const courtesyContacts = useAppSelector((state: RootState) => state.contactsState.digitalAddresses.courtesy);

  const phoneContacts = courtesyContacts.filter(contact => contact.channelType === CourtesyChannelType.SMS);
  const emailContacts = courtesyContacts.filter(contact => contact.channelType === CourtesyChannelType.EMAIL);
  
  return (
    <Box style={{ padding: '1rem' }}>
      <Grid container direction="row" sx={{marginTop: '1rem'}} spacing={2}>
        {phoneContacts.length > 0 ? 
          phoneContacts.map((contact) => <CourtesyContactItem key={contact.value} type={courtesyFieldType.PHONE} value={contact.value} isVerified={true} />)
          :
          <CourtesyContactItem type={courtesyFieldType.PHONE} value="" isVerified={false} />
        }
      </Grid>
      <Grid container direction="row" sx={{marginTop: '1rem'}} spacing={2}>
        {emailContacts.length > 0 ? 
          emailContacts.map((contact) => <CourtesyContactItem key={contact.value} type={courtesyFieldType.EMAIL} value={contact.value} isVerified={true} />)
          :
          <CourtesyContactItem type={courtesyFieldType.EMAIL} value="" isVerified={false} />
        }
      </Grid>
    </Box>
  );
};

export default CourtesyContactsList;