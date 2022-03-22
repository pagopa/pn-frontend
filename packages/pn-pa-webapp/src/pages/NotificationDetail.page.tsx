import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Breadcrumbs, Grid, Typography, Box, Paper, Button, styled } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import {
  NotificationStatus,
  TitleBox,
  DetailTableRow,
  NotificationDetailTable,
  NotificationDetailDocuments,
  LegalFactId,
  NotificationDetailTimeline,
} from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
  resetState,
} from '../redux/notification/actions';

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
  const sender = useAppSelector((state: RootState) => state.userState.user.organization?.id);
  const documentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.documentDownloadUrl
  );
  const legalFactDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadUrl
  );
  const detailTableRows: Array<DetailTableRow> = [
    { id: 1, label: 'Data', value: <Box fontWeight={600}>{notification.sentAt}</Box> },
    { id: 2, label: 'Termini di pagamento', value: `Entro il ` },
    {
      id: 3,
      label: 'Destinatario',
      value: <Box fontWeight={600}>{notification.recipients[0]?.taxId}</Box>,
    },
    {
      id: 4,
      label: 'Cognome Nome',
      value: <Box fontWeight={600}>{notification.recipients[0]?.denomination}</Box>,
    },
    { id: 5, label: 'Mittente', value: <Box fontWeight={600}>{sender}</Box> },
    {
      id: 6,
      label: 'Codice IUN annullato',
      value: <Box fontWeight={600}>{notification.cancelledIun}</Box>,
    },
    {
      id: 7,
      label: 'Codice IUN',
      value: <Box fontWeight={600}>{notification.iun}</Box>,
    },
    { id: 8, label: 'Gruppi', value: '' },
  ];
  const documentDowloadHandler = (documentIndex: number) => {
    void dispatch(getSentNotificationDocument({ iun: notification.iun, documentIndex }));
  };
  const legalFactDownloadHandler = (legalFact: LegalFactId) => {
    void dispatch(getSentNotificationLegalfact({ iun: notification.iun, legalFact }));
  };
  const dowloadDocument = (url: string) => {
    /* eslint-disable functional/immutable-data */
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.click();
    /* eslint-enable functional/immutable-data */
  };

  useEffect(() => {
    if (id) {
      void dispatch(getSentNotification(id));
    }
  }, []);

  useEffect(() => {
    if (documentDownloadUrl) {
      dowloadDocument(documentDownloadUrl);
    }
  }, [documentDownloadUrl]);

  useEffect(() => {
    if (legalFactDownloadUrl) {
      dowloadDocument(legalFactDownloadUrl);
    }
  }, [legalFactDownloadUrl]);

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
            <NotificationDetailTable rows={detailTableRows} />
            <Paper sx={{ padding: '24px', marginBottom: '20px' }} className="paperContainer">
              <NotificationDetailDocuments
                title="Atti Allegati"
                documents={notification.documents}
                clickHandler={documentDowloadHandler}
              />
            </Paper>
            <Button sx={{ margin: '10px 0' }} variant="outlined" onClick={() => navigate(-1)}>
              Indietro
            </Button>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box sx={{ backgroundColor: 'white', height: '100%', padding: '24px' }}>
            <NotificationDetailTimeline
              timeline={notification.timeline}
              statusHistory={notification.notificationStatusHistory}
              title="Stato della notifica"
              clickHandler={legalFactDownloadHandler}
              legalFactLabel="Attestato opponibile a Terzi"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationDetail;
