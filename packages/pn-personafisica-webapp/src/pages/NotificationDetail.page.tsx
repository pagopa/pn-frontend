import { useParams, useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Grid, Typography, Box, Paper, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import { TitleBox, LegalFactId,
  NotificationDetailDocuments,
  NotificationDetailTable,
  NotificationDetailTimeline, } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
  resetState, } from '../redux/notification/actions';
import StyledLink from '../component/StyledLink/StyledLink';

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
  const { t } = useTranslation(['notifiche', 'common']);
  const documentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.documentDownloadUrl
  );
  const legalFactDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadUrl
  );
  const detailTableRows: Array<{ id: number; label: string; value: ReactNode }> = [
    { id: 1, label: t('Data'), value: <Box fontWeight={600}>{notification.sentAt}</Box> },
    { id: 2, label: t('Termini di pagamento'), value: t(`Entro il `) },
    {
      id: 3,
      label: t('Destinatario'),
      value: <Box fontWeight={600}>{notification.recipients[0]?.taxId}</Box>,
    },
    {
      id: 4,
      label: t('Cognome Nome'),
      value: <Box fontWeight={600}>{notification.recipients[0]?.denomination}</Box>,
    },
    {
      id: 6,
      label: t('Codice IUN annullato'),
      value: <Box fontWeight={600}>{notification.cancelledIun}</Box>,
    },
    { id: 7, label: t('Codice IUN'), value: <Box fontWeight={600}>{notification.iun}</Box> },
    { id: 8, label: t('Gruppi'), value: '' },
  ];
  const documentDowloadHandler = (documentIndex: number) => {
    void dispatch(getReceivedNotificationDocument({ iun: notification.iun, documentIndex }));
  };
  const legalFactDownloadHandler = (legalFact: LegalFactId) => {
    void dispatch(getReceivedNotificationLegalfact({ iun: notification.iun, legalFact }));
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
      void dispatch(getReceivedNotification(id));
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
            <StyledLink to={routes.NOTIFICHE}>
              <EmailIcon sx={{ mr: 1 }} fontSize="inherit" />
              {t('detail.breadcrumb_1')}
            </StyledLink>
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              fontWeight={600}
            >
              {t('detail.breadcrumb_2')}
            </Typography>
          </Breadcrumbs>
          <Box sx={{ padding: '20px 0 0 0' }}>
            <TitleBox variantTitle="h4" title={notification.subject}></TitleBox>
            <NotificationDetailTable rows={detailTableRows} />
            <Paper sx={{ padding: '24px', marginBottom: '20px' }} className="paperContainer">
              <NotificationDetailDocuments
                title={t('Atti Allegati')}
                documents={notification.documents}
                clickHandler={documentDowloadHandler}
              />
            </Paper>
            <Button sx={{ margin: '10px 0' }} variant="outlined" onClick={() => navigate(-1)}>
              {t('button.indietro', { ns: 'common' })}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box sx={{ backgroundColor: 'white', height: '100%', padding: '24px' }}>
            <NotificationDetailTimeline
              timeline={notification.timeline}
              statusHistory={notification.notificationStatusHistory}
              title={t('Stato della notifica')}
              legalFactLabel={t('Attestato opponibile a Terzi')}
              clickHandler={legalFactDownloadHandler}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationDetail;
