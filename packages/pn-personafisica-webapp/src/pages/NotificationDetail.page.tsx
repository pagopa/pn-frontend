import { Fragment, ReactNode, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Grid, Box, Paper, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import {
  LegalFactId,
  NotificationDetailDocuments,
  // HelpNotificationDetails,
  NotificationDetailTableRow,
  NotificationDetailTable,
  NotificationDetailTimeline,
  TitleBox,
  useIsMobile,
  PnBreadcrumb,
  NotificationStatus,
  useErrors,
  ApiError,
} from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
  NOTIFICATION_ACTIONS
} from '../redux/notification/actions';
import { resetState } from '../redux/notification/reducers';
import NotificationPayment from '../component/Notifications/NotificationPayment';
import DomicileBanner from '../component/DomicileBanner/DomicileBanner';
import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
}));

const NotificationDetail = () => {
  const classes = useStyles();
  const { id, mandateId } = useParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common', 'notifiche']);
  const isMobile = useIsMobile();
  const { hasApiErrors } = useErrors();

  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const delegatorsFromStore = useAppSelector(
    (state: RootState) => state.generalInfoState.delegators
  );
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);

  const currentRecipient = notification && notification.currentRecipient;

  const noticeCode = currentRecipient?.payment?.noticeCode;
  const creditorTaxId = currentRecipient?.payment?.creditorTaxId;

  const documentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.documentDownloadUrl
  );
  const legalFactDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadUrl
  );
  const unfilteredDetailTableRows: Array<{
    label: string;
    rawValue: string | undefined;
    value: ReactNode;
  }> = [
    {
      label: t('detail.sender', { ns: 'notifiche' }),
      rawValue: notification.senderDenomination,
      value: <Box fontWeight={600}>{notification.senderDenomination}</Box>,
    },
    {
      label: t('detail.recipient', { ns: 'notifiche' }),
      rawValue: currentRecipient?.denomination,
      value: <Box fontWeight={600}>{currentRecipient?.denomination}</Box>,
    },
    {
      label: t('detail.date', { ns: 'notifiche' }),
      rawValue: notification.sentAt,
      value: <Box fontWeight={600}>{notification.sentAt}</Box>,
    },
    {
      label: t('detail.payment-terms', { ns: 'notifiche' }),
      rawValue: notification.paymentExpirationDate,
      value: <Box fontWeight={600}>{notification.paymentExpirationDate}</Box>,
    },
    {
      label: t('detail.iun', { ns: 'notifiche' }),
      rawValue: notification.iun,
      value: <Box fontWeight={600}>{notification.iun}</Box>,
    },
    {
      label: t('detail.cancelled-iun', { ns: 'notifiche' }),
      rawValue: notification.cancelledIun,
      value: <Box fontWeight={600}>{notification.cancelledIun}</Box>,
    },
  ];
  const detailTableRows: Array<NotificationDetailTableRow> = unfilteredDetailTableRows
    .filter((row) => row.rawValue)
    .map((row, index) => ({
      id: index + 1,
      label: row.label,
      value: row.value,
    }));

  const documentDowloadHandler = (documentIndex: string | undefined) => {
    if (documentIndex) {
      void dispatch(
        getReceivedNotificationDocument({ iun: notification.iun, documentIndex, mandateId })
      );
    }
  };

  const legalFactDownloadHandler = (legalFact: LegalFactId) => {
    void dispatch(
      getReceivedNotificationLegalfact({ iun: notification.iun, legalFact, mandateId })
    );
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

  const isCancelled =
    notification.notificationStatus === NotificationStatus.CANCELLED ? true : false;

  const hasDocumentsAvailable = isCancelled || !notification.documentsAvailable ? false : true;

  const hasNotificationReceivedApiError = hasApiErrors(NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMATION);

  const getDownloadFilesMessage = useCallback((): string => {
    if (isCancelled) {
      return t('detail.acts_files.notification_cancelled', { ns: 'notifiche' });
    } else if (hasDocumentsAvailable) {
      return t('detail.acts_files.downloadable_acts', { ns: 'notifiche' });
    } else {
      return t('detail.acts_files.not_downloadable_acts', { ns: 'notifiche' });
    }
  }, [isCancelled, hasDocumentsAvailable]);

  const fetchReceivedNotification = useCallback(() => {
    if (id) {
      void dispatch(
        getReceivedNotification({
          iun: id,
          currentUserTaxId: currentUser.fiscal_number,
          delegatorsFromStore,
          mandateId,
        })
      );
    }
  }, []);

  useEffect(() => {
    fetchReceivedNotification();
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

  const properBreadcrumb = (
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
  );
  const breadcrumb = (
    <Fragment>
      {properBreadcrumb}
      <TitleBox
        variantTitle="h4"
        title={notification.subject}
        sx={{ pt: 3, mb: 2 }}
        mbTitle={0}
      ></TitleBox>
      <Typography variant="body1" mb={{ xs: 3, md: 4 }}>
        {notification.abstract}
      </Typography>
    </Fragment>
  );

  return (<>
    {hasNotificationReceivedApiError && <Box className={classes.root} sx={{ p: 3 }}>
      {properBreadcrumb}
      <ApiError onClick={fetchReceivedNotification} mt={3} />
    </Box>}
    {!hasNotificationReceivedApiError && 
      <Box className={classes.root} sx={{ p: { xs: 3, lg: 0 } }}>
        {isMobile && breadcrumb}
        <Grid container direction={isMobile ? 'column-reverse' : 'row'} spacing={isMobile ? 3 : 0}>
          <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
            {!isMobile && breadcrumb}
            <Stack spacing={3}>
              <NotificationDetailTable rows={detailTableRows} />
              {!isCancelled && currentRecipient?.payment && creditorTaxId && noticeCode && (
                <NotificationPayment
                  iun={notification.iun}
                  notificationPayment={notification.iun === "PNGR-KGRE-MYGL-202209-A-1" ? {...currentRecipient.payment, noticeCode: undefined} : currentRecipient.payment}
                  onDocumentDownload={dowloadDocument}
                  mandateId={mandateId}
                />
              )}
              <DomicileBanner />
              <Paper sx={{ p: 3 }} className="paperContainer">
                <NotificationDetailDocuments
                  title={t('detail.acts', { ns: 'notifiche' })}
                  documents={isCancelled ? [] : notification.documents}
                  clickHandler={documentDowloadHandler}
                  documentsAvailable={hasDocumentsAvailable}
                  downloadFilesMessage={getDownloadFilesMessage()}
                  downloadFilesLink={t('detail.acts_files.effected_faq', { ns: 'notifiche' })}
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
            <Box component="section" sx={{ backgroundColor: 'white', height: '100%', p: 3 }}>
              <NotificationDetailTimeline
                recipients={notification.recipients}
                statusHistory={notification.notificationStatusHistory}
                title={t('detail.timeline-title', { ns: 'notifiche' })}
                clickHandler={legalFactDownloadHandler}
                historyButtonLabel={t('detail.show-history', { ns: 'notifiche' })}
                showMoreButtonLabel={t('detail.show-more', { ns: 'notifiche' })}
                showLessButtonLabel={t('detail.show-less', { ns: 'notifiche' })}
                eventTrackingCallbackShowMore={() =>
                  trackEventByType(TrackEventType.NOTIFICATION_TIMELINE_VIEW_MORE)
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    }
  </>);
};

export default NotificationDetail;
