import { useParams } from 'react-router-dom';
import { Breadcrumbs, Grid, Typography, Link, Box, styled } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const StyledLink = styled(Link)(({ theme }) => (
  {
    color: theme.palette.text.primary + '!important',
    textDecoration: 'none !important',
    '&:hover, &:focus': {
      textDecoration: 'underline !important'
    }
  }
));

const NotificationDetail = () => {
  const { id } = useParams();

  console.log(id);

  return (
    <Box style={{ padding: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Breadcrumbs aria-label="breadcrumb">
            <StyledLink href="/dashboard" sx={{ display: 'flex', alignItems: 'center'}}>
              <EmailIcon sx={{ mr: 0.5 }} />
              Notifiche
            </StyledLink>
            <Typography color="text.primary" fontWeight={600}>Dettaglio notifica</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={5}></Grid>
      </Grid>
    </Box>
  );
};

export default NotificationDetail;
