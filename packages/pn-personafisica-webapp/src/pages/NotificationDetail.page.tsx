import { useParams, useNavigate } from 'react-router-dom';
import { Fragment, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Grid, Typography, Box, Paper, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import {
  TitleBox,
  LegalFactId,
  NotificationDetailDocuments,
  NotificationDetailTable,
  NotificationDetailTimeline,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
  resetState,
} from '../redux/notification/actions';
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
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'notifiche']);
  const isMobile = useIsMobile();
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const documentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.documentDownloadUrl
  );
  const legalFactDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadUrl
  );
  const detailTableRows: Array<{ id: number; label: string; value: ReactNode }> = [
    { id: 1, label: t('detail.date', { ns: 'notifiche' }), value: <Box fontWeight={600}>{notification.sentAt}</Box> },
    { id: 2, label: t('detail.payment-terms', { ns: 'notifiche' }), value: t('detail.payment-terms-expiration', { ns: 'notifiche' }) },
    {
      id: 3,
      label: t('detail.recipient', { ns: 'notifiche' }),
      value: <Box fontWeight={600}>{notification.recipients[0]?.taxId}</Box>,
    },
    {
      id: 4,
      label: t('detail.surname-name', { ns: 'notifiche' }),
      value: <Box fontWeight={600}>{notification.recipients[0]?.denomination}</Box>,
    },
    {
      id: 6,
      label: t('detail.cancelled-iun', { ns: 'notifiche' }),
      value: <Box fontWeight={600}>{notification.cancelledIun}</Box>,
    },
    { id: 7, label: t('detail.iun', { ns: 'notifiche' }), value: <Box fontWeight={600}>{notification.iun}</Box> },
    { id: 8, label: t('detail.groups', { ns: 'notifiche' }), value: '' },
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

  const breadcrumb = (
    <Fragment>
      <Breadcrumbs aria-label="breadcrumb">
        <StyledLink to={routes.NOTIFICHE}>
          <EmailIcon sx={{ mr: 0.5 }} />
          {t('detail.breadcrumb-root', { ns: 'notifiche' })}
        </StyledLink>
        <Typography
          color="text.primary"
          fontWeight={600}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {t('detail.breadcrumb-leaf', { ns: 'notifiche' })}
        </Typography>
      </Breadcrumbs>
      <TitleBox variantTitle="h4" title={notification.subject} sx={{ pt: '20px' }}></TitleBox>
    </Fragment>
  );

  return (
    <Box className={classes.root} sx={{ padding: isMobile ? '0 20px' : 0 }}>
      {isMobile && breadcrumb}
      <Grid container spacing={2} direction={isMobile ? 'column-reverse' : 'row'}>
        <Grid item lg={7} xs={12} sx={{ marginTop: isMobile ? 0 : '20px' }}>
          {!isMobile && breadcrumb}
          <NotificationDetailTable rows={detailTableRows} />
          <Paper sx={{ padding: '24px', marginBottom: '20px' }} className="paperContainer">
            <NotificationDetailDocuments
              title={t('detail.acts', { ns: 'notifiche' })}
              documents={notification.documents}
              clickHandler={documentDowloadHandler}
            />
          </Paper>
          <Button sx={{ margin: '10px 0' }} variant="outlined" onClick={() => navigate(-1)}>
            {t('button.indietro', { ns: 'common' })}
          </Button>
        </Grid>
        <Grid item lg={5} xs={12}>
          <Box sx={{ backgroundColor: 'white', height: '100%', padding: '24px' }}>
            <NotificationDetailTimeline
              timeline={notification.timeline}
              statusHistory={notification.notificationStatusHistory}
              title={t('detail.timeline-title', { ns: 'notifiche' })}
              legalFactLabel={t('detail.legalfact', { ns: 'notifiche' })}
              clickHandler={legalFactDownloadHandler}
              historyButtonLabel={t('detail.show-history', {ns: 'notifiche'})}
              showMoreButtonLabel={t('detail.show-more', {ns: 'notifiche'})}
              showLessButtonLabel={t('detail.show-less', {ns: 'notifiche'})}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationDetail;
