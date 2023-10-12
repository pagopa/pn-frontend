import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Avatar, Grid, Typography } from '@mui/material';

type DropDownPartyProps = {
  name: string;
  children?: React.ReactNode;
};

const DropDownPartyMenuItem: React.FC<DropDownPartyProps> = ({ name }) => (
  <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
    <Grid item md="auto" xs={2}>
      <Avatar sx={{ backgroundColor: '#F5F5F5' }}>
        <AccountBalanceIcon sx={{ color: '#A2ADB8' }} />
      </Avatar>
    </Grid>
    <Grid item xl={10} lg={8} xs={10}>
      <Typography fontWeight={600}>{name}</Typography>
    </Grid>
  </Grid>
);

export default DropDownPartyMenuItem;
