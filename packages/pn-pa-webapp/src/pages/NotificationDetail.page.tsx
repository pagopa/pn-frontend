import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Breadcrumbs, Grid, Typography, Box, Paper, Button, styled } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import { NotificationStatus, TitleBox } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getSentNotification, resetState } from '../redux/notification/actions';
import DetailTable from './components/NotificationDetail/DetailTable';
import DetailTimeline from './components/NotificationDetail/DetailTimeline';
import DetailDocuments from './components/NotificationDetail/DetailDocuments';

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: `${theme.palette.text.primary} !important`,
  texDecoration: 'none !important',
  '&:hover, &:focus': {
    textDecoration: 'underline !important',
  },
}));

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
}));

const NotificationDetail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      void dispatch(getSentNotification(id));
    }
  }, []);

  useEffect(() => () => void dispatch(resetState()), []);

  return (
    <Box className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={7} sx={{ marginTop: '20px' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <StyledLink to={routes.DASHBOARD}>
              <EmailIcon sx={{ mr: 0.5 }} />
              Notifiche
            </StyledLink>
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              fontWeight={600}
            >
              Dettaglio Notifica
            </Typography>
          </Breadcrumbs>
          <Box sx={{ padding: '20px 0 0 0' }}>
            <TitleBox variantTitle="h4" title={notification.subject}></TitleBox>
            {notification.notificationStatus !== NotificationStatus.PAID && (
              <Button sx={{ margin: '10px 0' }} variant="outlined">
                Annulla Notifica
              </Button>
            )}
            <DetailTable notification={notification} />
            <Paper sx={{ padding: '24px', marginBottom: '20px' }} className="paperContainer">
              <DetailDocuments notification={notification} />
            </Paper>
            <Button sx={{ margin: '10px 0' }} variant="outlined" onClick={() => navigate(-1)}>
              Indietro
            </Button>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box sx={{ backgroundColor: 'white', height: '100%', padding: '24px' }}>
            <DetailTimeline notification={notification} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationDetail;
