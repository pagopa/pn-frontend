import { useParams, Link } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { Breadcrumbs, Grid, Typography, Box, styled, TableContainer, Paper, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getSentNotification } from '../redux/notification/actions';

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
    '& .detail-info': {
      paddingTop: 20,
    },
  },
}));

const NotificationDetail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);

  /* eslint-disable-next-line functional/no-let */
  let detailTable: Array<{id: number; label: string; value: ReactNode}> = [];
  if (Object.keys(notification).length) {
    detailTable = [
      { id: 1, label: 'Data', value: notification.sentAt },
      { id: 2, label: 'Termini di pagamento', value: notification.payment },
      { id: 3, label: 'Destinatario', value: notification.recipients[0]?.taxId },
      { id: 4, label: 'Cognome Nome', value: notification.recipients[0]?.denomination },
      { id: 5, label: 'Mittente', value: '' },
      { id: 6, label: 'Codice IUN annullato', value: notification.cancelledIun },
      { id: 7, label: 'Codice IUN', value: notification.iun },
      { id: 8, label: 'Gruppi', value: '' }
    ];
  }

  useEffect(() => {
    if (id) {
      void dispatch(getSentNotification(id));
    }
  }, []);

  return (
    <Box style={{ padding: '20px' }} className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Breadcrumbs aria-label="breadcrumb">
            <StyledLink to={routes.DASHBOARD}>
              <EmailIcon sx={{ mr: 0.5 }} />
              Notifiche
            </StyledLink>
            <Typography color="text.primary" fontWeight={600}>
              Dettaglio notifica
            </Typography>
          </Breadcrumbs>
          <Box sx={{ padding: '20px 0' }}>
            <Typography variant="h4">{notification.subject}</Typography>
            <TableContainer component={Paper} sx={{ margin: '20px 0' }}>
              <Table aria-label="notification detail">
                <TableBody>
                  {detailTable.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{row.label}</TableCell>
                      <TableCell sx={{fontWeight: 600}}>{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
        <Grid item xs={5}></Grid>
      </Grid>
    </Box>
  );
};

export default NotificationDetail;
