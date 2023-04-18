import { Grid, Typography, Avatar } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

type DropDownPartyProps = {
  name: string;
};

const DropDownPartyMenuItem: React.FC<DropDownPartyProps> = ({ name }) => (
  <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
    <Grid item md="auto" xs={2}>
      <Avatar sx={{ backgroundColor: '#F5F5F5' }}>
        <AccountBalanceIcon sx={{ color: '#A2ADB8' }} />
      </Avatar>
    </Grid>
    <Grid item xs={10} sx={{ whiteSpace: 'wrap' }}>
      <Typography fontWeight={600}>{name}</Typography>
    </Grid>
  </Grid>
);

export default DropDownPartyMenuItem;
