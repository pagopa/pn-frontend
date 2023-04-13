import { Grid, Typography, Avatar } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

type DropDownPartyProps = {
  name: string;
};

const DropDownPartyMenuItem: React.FC<DropDownPartyProps> = ({ name }) => (
  <Grid container>
    <Grid item xs={2}>
      <Avatar sx={{ backgroundColor: '#F5F5F5' }}>
        <AccountBalanceIcon sx={{ margin: 'auto', color: '#A2ADB8' }} />
      </Avatar>
    </Grid>
    <Grid item xs={10} sx={{ margin: 'auto', whiteSpace: 'wrap' }}>
      <Typography fontWeight={600} sx={{ margin: 'auto', textAlign: 'left' }}>
        {name}
      </Typography>
    </Grid>
  </Grid>
);

export default DropDownPartyMenuItem;
