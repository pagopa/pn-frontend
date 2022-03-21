import { Grid, Typography, Avatar } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

type DropDownEntiProps = {
  name: string;
};

const DropDownEntiMenuItem: React.FC<DropDownEntiProps> = ({ name }) => (
  <Grid container>
    <Grid item xs={2}>
      <Avatar sx={{ backgroundColor: '#F5F5F5' }}>
        <AccountBalanceIcon sx={{ margin: 'auto', color: '#A2ADB8' }}></AccountBalanceIcon>
      </Avatar>
    </Grid>
    <Grid item xs={4} sx={{ margin: 'auto' }}>
      <Typography sx={{ margin: 'auto', textAlign: 'left', fontWeight: 600 }}>{name}</Typography>
    </Grid>
    <Grid item xs={6} sx={{ margin: 'auto' }}></Grid>
  </Grid>
);

export default DropDownEntiMenuItem;
