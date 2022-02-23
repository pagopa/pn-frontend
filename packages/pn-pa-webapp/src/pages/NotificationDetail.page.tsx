import { useParams, Link } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import {
  Breadcrumbs,
  Grid,
  Typography,
  Box,
  styled,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import EmailIcon from '@mui/icons-material/Email';
import DownloadIcon from '@mui/icons-material/Download';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getSentNotification } from '../redux/notification/actions';
import { NotificationStatus } from '../redux/dashboard/types';
import { getMonthString, getDay, getTime } from '../utils/date.utility';
import { getNotificationStatusLabelAndColor } from '../utils/status.utility';

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
  const sender = useAppSelector((state: RootState) => state.userState.user.organization?.id);
  const detailTable: Array<{ id: number; label: string; value: ReactNode }> = [
    { id: 1, label: 'Data', value: <Box fontWeight={600}>{notification.sentAt}</Box> },
    { id: 2, label: 'Termini di pagamento', value: `Entro il ` },
    { id: 3, label: 'Destinatario', value: <Box fontWeight={600}>{notification.recipients[0]?.taxId}</Box> },
    { id: 4, label: 'Cognome Nome', value: <Box fontWeight={600}>{notification.recipients[0]?.denomination}</Box> },
    { id: 5, label: 'Mittente', value: <Box fontWeight={600}>{sender}</Box> },
    { id: 6, label: 'Codice IUN annullato', value: <Box fontWeight={600}>{notification.cancelledIun}</Box> },
    { id: 7, label: 'Codice IUN', value: <Box fontWeight={600}>{notification.cancelledByIun}</Box> },
    { id: 8, label: 'Gruppi', value: '' },
  ];

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
            <TableContainer component={Paper} sx={{ margin: '20px 0' }} className="paperContainer">
              <Table aria-label="notification detail">
                <TableBody>
                  {detailTable.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{row.label}</TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
            <Box>
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography
                    color="text.primary"
                    fontWeight={700}
                    textTransform="uppercase"
                    fontSize={14}
                  >
                    Stato della notifica
                  </Typography>
                </Grid>
                <Grid item>
                  <Button startIcon={<DownloadIcon />}>Scarica tutti gli allegati</Button>
                </Grid>
              </Grid>
            </Box>
            <Timeline>
              {notification.notificationStatusHistory.map((h, i) => (
                <TimelineItem key={h.activeFrom}>
                  <TimelineOppositeContent sx={{ textAlign: 'center', margin: 'auto 0' }}>
                    <Typography color="text.secondary" fontSize={14}>
                      {getMonthString(h.activeFrom)}
                    </Typography>
                    <Typography fontWeight={600} fontSize={18}>
                      {getDay(h.activeFrom)}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot variant={i === 0 ? 'outlined' : undefined} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent
                    sx={{ flex: '3', msFlex: '3', WebkitFlex: '3', padding: '10px 16px' }}
                  >
                    <Typography color="text.secondary" fontSize={14} sx={{ paddingBottom: '8px' }}>
                      {getTime(h.activeFrom)}
                    </Typography>
                    <Chip
                      label={getNotificationStatusLabelAndColor(h.status).label}
                      color={getNotificationStatusLabelAndColor(h.status).color}
                    />
                    <Box>
                      <Button
                        sx={{ paddingLeft: 0, paddingRight: 0, marginTop: '5px' }}
                        startIcon={<AttachFileIcon />}
                      >
                        Attestato opponibile a Terzi
                      </Button>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationDetail;
