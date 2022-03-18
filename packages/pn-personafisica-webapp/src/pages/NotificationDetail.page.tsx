import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Grid, Typography, Box, styled, Paper, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import DetailTimeline from '../component/NotificationDetail/DetailTimeline';
import DetailTable from '../component/NotificationDetail/DetailTable';
import DetailDocuments from '../component/NotificationDetail/DetailDocuments';
import { getReceivedNotification, resetState } from '../redux/notification/actions';

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
  const { t } = useTranslation(['notifiche']);

  useEffect(() => {
    if (id) {
      void dispatch(getReceivedNotification(id));
    }
  }, []);

  useEffect(() => () => void dispatch(resetState()), []);

  return (
    <Box className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={7} sx={{ marginTop: '20px' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <StyledLink to={routes.NOTIFICHE}>
              <EmailIcon sx={{ mr: 0.5 }} />
              {t('Notifiche')}
            </StyledLink>
            <Typography color="text.primary" fontWeight={600}>
              {t('Dettaglio notifica')}
            </Typography>
          </Breadcrumbs>
          <Box sx={{ padding: '20px 0 0 0' }}>
            <Typography variant="h4">{notification.subject}</Typography>
            <DetailTable notification={notification} />
            <Paper sx={{ padding: '24px', marginBottom: '20px' }} className="paperContainer">
              <DetailDocuments notification={notification} />
            </Paper>
            <Button sx={{ margin: '10px 0' }} variant="outlined" onClick={() => navigate(-1)}>
              {t('Indietro')}
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
