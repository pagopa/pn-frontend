import { Box, Grid } from '@mui/material';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { CourtesyChannelType} from "../../models/contacts";
import CourtesyContactItem from "./CourtesyContactItem";

const CourtesyContactsList = () => {
  const courtesyContacts = useAppSelector((state: RootState) => state.contactsState.digitalAddresses.courtesy);

  const phoneContacts = courtesyContacts.filter(contact => contact.channelType === CourtesyChannelType.SMS);
  const emailContacts = courtesyContacts.filter(contact => contact.channelType === CourtesyChannelType.EMAIL);
  
  return (
    <Box style={{ padding: '20px' }}>
      <Grid container direction="row" sx={{marginTop: '20px'}} spacing={2}>
        {phoneContacts.length > 0 ? 
          phoneContacts.map((contact) => <CourtesyContactItem key={contact.value} fieldType="phone" fieldValue={contact.value} isVerified={true} />)
          :
          <CourtesyContactItem key="phone" fieldType="phone" fieldValue="" isVerified={false} />
        }
      </Grid>
      <Grid container direction="row" sx={{marginTop: '20px'}} spacing={2}>
        {emailContacts.length > 0 ? 
          emailContacts.map((contact) => <CourtesyContactItem key={contact.value} fieldType="email" fieldValue={contact.value} isVerified={true} />)
          :
          <CourtesyContactItem key="email" fieldType="email" fieldValue="" isVerified={false} />
        }
      </Grid>
    </Box>
  );
};

export default CourtesyContactsList;