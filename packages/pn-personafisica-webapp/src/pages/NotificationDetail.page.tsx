import { Fragment, ReactNode, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Grid, Box, Paper, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import {
  TitleBox,
  LegalFactId,
  NotificationDetailDocuments,
  // HelpNotificationDetails,
  NotificationDetailTable,
  NotificationDetailTimeline,
  useIsMobile,
  PnBreadcrumb,
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
import NotificationPayment from '../component/Notifications/NotificationPayment';
import DomicileBanner from '../component/DomicileBanner/DomicileBanner';

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
  const { t } = useTranslation(['common', 'notifiche']);
  const isMobile = useIsMobile();
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  
  const currentUser = useAppSelector((state: RootState) => state.userState.user);

  const currentRecipient = notification.recipients.filter((recipient) => recipient.taxId === currentUser.fiscal_number)[0];

  const documentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.documentDownloadUrl
  );
  const legalFactDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadUrl
  );
  const detailTableRows: Array<{ id: number; label: string; value: ReactNode }> = [
    {
      id: 1,
      label: t('detail.date', { ns: 'notifiche' }),
      value: <Box fontWeight={600}>{notification.sentAt}</Box>,
    },
    {
      id: 2,
      label: t('detail.payment-terms', { ns: 'notifiche' }),
      value: t('detail.payment-terms-expiration', { ns: 'notifiche' }),
    },
    {
      id: 3,
      label: t('detail.surname-name', { ns: 'notifiche' }),
      value: <Box fontWeight={600}>{currentRecipient?.denomination}</Box>,
    },
    {
      id: 4,
      label: t('detail.sender', { ns: 'notifiche' }),
      value: <Box fontWeight={600}>{notification.senderDenomination}</Box>,
    },
    {
      id: 6,
      label: t('detail.cancelled-iun', { ns: 'notifiche' }),
      value: <Box fontWeight={600}>{notification.cancelledIun}</Box>,
    },
    {
      id: 7,
      label: t('detail.iun', { ns: 'notifiche' }),
      value: <Box fontWeight={600}>{notification.iun}</Box>,
    },
    {
      id: 8,
      label: t('detail.notice-code', { ns: 'notifiche' }),
      value: <Box fontWeight={600}>{currentRecipient?.payment?.noticeCode}</Box>,
    },
    {
      id: 9,
      label: t('detail.creditor-tax-id', { ns: 'notifiche' }),
      value: <Box fontWeight={600}>{currentRecipient?.payment?.creditorTaxId}</Box>,
    },
  ];
  const documentDowloadHandler = (documentIndex: string | undefined) => {
    if (documentIndex) {
      void dispatch(getReceivedNotificationDocument({ iun: notification.iun, documentIndex }));
    }
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
    return () => void dispatch(resetState());
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

  const breadcrumb = (
    <Fragment>
      <PnBreadcrumb
        goBackLabel={t('button.indietro', { ns: 'common' })}
        linkRoute={routes.NOTIFICHE}
        linkLabel={
          <Fragment>
            <EmailIcon sx={{ mr: 0.5 }} />
            {t('detail.breadcrumb-root', { ns: 'notifiche' })}
          </Fragment>
        }
        currentLocationLabel={t('detail.breadcrumb-leaf', { ns: 'notifiche' })}
      />
      <TitleBox variantTitle="h4" title={notification.subject} sx={{ pt: 3, mb: 4 }}></TitleBox>
    </Fragment>
  );

  return (
    <Box className={classes.root} sx={{ p: { xs: 3, lg: 0 } }}>
      {isMobile && breadcrumb}
      <Grid container direction={isMobile ? 'column-reverse' : 'row'}>
        <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
          {!isMobile && breadcrumb}
          <Stack spacing={3}>
          <NotificationDetailTable rows={detailTableRows} />
          {currentRecipient?.payment && (
            <NotificationPayment
              iun={notification.iun}
              notificationPayment={currentRecipient.payment}
              onDocumentDownload={dowloadDocument}
            />
          )}
          <DomicileBanner />
          <Paper sx={{ p: 3 }} className="paperContainer">
            <NotificationDetailDocuments
              title={t('detail.acts', { ns: 'notifiche' })}
              documents={notification.documents}
              clickHandler={documentDowloadHandler}
              documentsAvailable={notification.documentsAvailable}
              downloadFilesMessage={
                notification.documentsAvailable
                  ? t('detail.acts_files.downloadable_acts', { ns: 'notifiche' })
                  : t('detail.acts_files.not_downloadable_acts', { ns: 'notifiche' })
              }
            />
          </Paper>
          {/* TODO decommentare con pn-841
          <Paper sx={{ p: 3 }} className="paperContainer">
            <HelpNotificationDetails 
              title="Hai bisogno di aiuto?"
              subtitle="Se hai domande relative al contenuto della notifica, contatta il"
              courtName="Tribunale di Milano"
              phoneNumber="848.800.444"
              mail="nome.cognome@email.it"
              website="https://www.tribunale.milano.it/"
            />              
          </Paper>
              */}
          </Stack>
        </Grid>
        <Grid item lg={5} xs={12}>
          <Box
            component="section"
            sx={{ backgroundColor: 'white', height: '100%', p: 3 }}
          >
            <NotificationDetailTimeline
              recipients={notification.recipients}
              statusHistory={notification.notificationStatusHistory}
              title={t('detail.timeline-title', { ns: 'notifiche' })}
              legalFactLabels={{
                attestation: t('detail.legalfact', { ns: 'notifiche' }),
                receipt: t('detail.receipt', { ns: 'notifiche' }),
              }}
              clickHandler={legalFactDownloadHandler}
              historyButtonLabel={t('detail.show-history', { ns: 'notifiche' })}
              showMoreButtonLabel={t('detail.show-more', { ns: 'notifiche' })}
              showLessButtonLabel={t('detail.show-less', { ns: 'notifiche' })}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationDetail;
