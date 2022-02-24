import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Breadcrumbs,
  Grid,
  Typography,
  Box,
  styled,
  Paper,
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import DownloadIcon from '@mui/icons-material/Download';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getSentNotification } from '../redux/notification/actions';
import { NotificationStatus } from '../redux/dashboard/types';
import DetailTable from './components/NotificationDetail/DetailTable';
import DetailTimeline from './components/NotificationDetail/DetailTimeline';

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

  useEffect(() => {
    if (id) {
      void dispatch(getSentNotification(id));
    }
  }, []);

  return (
    <Box className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={7} sx={{ marginTop: '20px' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <StyledLink to={routes.DASHBOARD}>
              <EmailIcon sx={{ mr: 0.5 }} />
              Notifiche
            </StyledLink>
            <Typography color="text.primary" fontWeight={600}>
              Dettaglio notifica
            </Typography>
          </Breadcrumbs>
          <Box sx={{ padding: '20px 0 0 0' }}>
            <Typography variant="h4">{notification.subject}</Typography>
            {notification.notificationStatus !== NotificationStatus.PAID && (
              <Button sx={{ margin: '10px 0' }} variant="outlined">
                Annulla Notifica
              </Button>
            )}
            <DetailTable notification={notification}/>
            <Paper sx={{ padding: '24px' }} className="paperContainer">
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography
                    color="text.primary"
                    fontWeight={700}
                    textTransform="uppercase"
                    fontSize={14}
                  >
                    Atti Allegati
                  </Typography>
                </Grid>
                <Grid item>
                  <Button startIcon={<DownloadIcon />}>Scarica tutti gli Atti</Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box sx={{ backgroundColor: 'white', height: '100%', padding: '24px' }}>
            <DetailTimeline notification={notification}/>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationDetail;
